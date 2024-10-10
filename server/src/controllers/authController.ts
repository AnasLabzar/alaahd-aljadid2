import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; // Use bcryptjs for hashing passwords
import { User } from '../models/User';

// Register a User with Password Hashing
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Store hashed password
      role: role || 'customer'  // Default role is customer
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Log in a User with Password Comparison
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Get user by ID
// export const getUserById = async (req: Request, res: Response) => {
//   const userId = req.params._id;

//   try {
//     // Find the user by ID in the database
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Respond with the user data
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err });

//     // For other types of errors
//     res.status(500).json({ message: 'Server error', err });
//   }
// };


// Get a product by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};


export const getUserByCustom = async (req: Request, res: Response) => {
  try {
    const customers = await User.find({ role: 'custom' }); // Ensure role is 'custom'
    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: 'No users with the role custom found' });
    }
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};


// Get all products
export const getAllUser = async (_req: Request, res: Response) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};