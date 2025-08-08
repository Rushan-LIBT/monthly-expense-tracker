const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from Render deployed frontend, localhost for development, and direct API calls
    const allowedOrigins = [
      /^https:\/\/.*\.onrender\.com$/,  // Any Render subdomain
      /^http:\/\/localhost:\d+$/,       // Local development
      process.env.FRONTEND_URL          // Custom frontend URL
    ].filter(Boolean);
    
    // Allow requests with no origin (mobile apps, API tools, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(origin);
      }
      return pattern === origin;
    });
    
    callback(null, isAllowed);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/FinanceDB')
  .then(() => {
    console.log('Connected to MongoDB Atlas - Cluster0/FinanceDB');
    console.log('Database:', mongoose.connection.db.databaseName);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.error('Please check your .env file and MongoDB credentials');
  });

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
}, { 
  timestamps: true,
  collection: 'users'
});

const ExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other']
  },
  date: {
    type: Date,
    required: true,
  },
  monthlySalary: {
    type: Number,
    default: null,
    min: 0
  },
}, { 
  timestamps: true,
  collection: 'FinanceData'
});

const User = mongoose.model('User', UserSchema);
const Expense = mongoose.model('Expense', ExpenseSchema);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Get salary from FinanceData collection
    const expenseWithSalary = await Expense.findOne({
      userId: user._id,
      monthlySalary: { $exists: true, $ne: null }
    });
    const monthlySalary = expenseWithSalary ? expenseWithSalary.monthlySalary : 0;

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        monthlySalary: monthlySalary,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Get salary from FinanceData collection
    const expenseWithSalary = await Expense.findOne({
      userId: user._id,
      monthlySalary: { $exists: true, $ne: null }
    });
    const monthlySalary = expenseWithSalary ? expenseWithSalary.monthlySalary : 0;

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        monthlySalary: monthlySalary,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ 
      userId: req.user.userId
    }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    // Get current salary to include in the new expense record
    const existingExpenseWithSalary = await Expense.findOne({
      userId: req.user.userId,
      monthlySalary: { $exists: true, $ne: null }
    });
    const currentSalary = existingExpenseWithSalary ? existingExpenseWithSalary.monthlySalary : null;

    const expense = new Expense({
      userId: req.user.userId,
      description,
      amount,
      category,
      date,
      monthlySalary: currentSalary
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile with salary from FinanceData
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get salary from any FinanceData record for this user
    const expenseWithSalary = await Expense.findOne({
      userId: req.user.userId,
      monthlySalary: { $exists: true, $ne: null }
    });

    const monthlySalary = expenseWithSalary ? expenseWithSalary.monthlySalary : 0;

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      monthlySalary: monthlySalary,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update monthly salary in FinanceData collection
app.put('/api/salary', authenticateToken, async (req, res) => {
  try {
    console.log('Salary update request received:', {
      userId: req.user.userId,
      body: req.body,
      monthlySalary: req.body.monthlySalary,
      type: typeof req.body.monthlySalary
    });
    
    const { monthlySalary } = req.body;

    if (typeof monthlySalary !== 'number' || monthlySalary < 0) {
      console.log('Invalid salary value:', { monthlySalary, type: typeof monthlySalary });
      return res.status(400).json({ message: 'Monthly salary must be a positive number' });
    }

    console.log('Looking for user with ID:', req.user.userId);
    
    // First verify user exists - handle both ObjectId and string formats
    console.log('Looking for user with ID:', req.user.userId, 'Type:', typeof req.user.userId);
    
    let user;
    try {
      // Try direct lookup first
      user = await User.findById(req.user.userId).select('-password');
      
      // If not found and it's a string, try converting to ObjectId
      if (!user && typeof req.user.userId === 'string') {
        user = await User.findById(new mongoose.Types.ObjectId(req.user.userId)).select('-password');
      }
      
      // If still not found, try finding by the old file-based ID format
      if (!user) {
        user = await User.findOne({ username: req.user.username }).select('-password');
        console.log('Fallback: Found user by username:', user ? user._id : 'NOT FOUND');
      }
      
    } catch (error) {
      console.log('Error finding user:', error.message);
    }
    
    if (!user) {
      console.log('User not found with any method. Token userId:', req.user.userId);
      return res.status(404).json({ message: 'User not found. Please login again.' });
    }
    
    console.log('✅ User found:', user.username, 'ID:', user._id);

    // Update monthlySalary field for all records of this user in FinanceData collection
    // Use the found user's actual MongoDB _id
    const updateResult = await Expense.updateMany(
      { userId: user._id },
      { $set: { monthlySalary: monthlySalary } }
    );

    console.log('Salary field updated in FinanceData:', {
      userId: user._id,
      newSalary: monthlySalary,
      modifiedCount: updateResult.modifiedCount
    });

    // If user has no expense records yet, create a placeholder record with salary
    if (updateResult.matchedCount === 0) {
      const placeholderRecord = new Expense({
        userId: user._id, // Use the correct user._id
        description: 'Initial Setup - Monthly Salary',
        amount: 0,
        category: 'Other',
        date: new Date(),
        monthlySalary: monthlySalary
      });
      await placeholderRecord.save();
      console.log('Created placeholder record with salary:', placeholderRecord._id);
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      monthlySalary: monthlySalary,
    });
  } catch (error) {
    console.error('Update salary error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});