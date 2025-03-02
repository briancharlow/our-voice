import bcrypt from 'bcrypt';
import session from 'express-session';
import { DbHelper } from '../Database Helper/dbHelper.js';
import {validateUser } from '../validators/validators.js';
import { sendWelcomeEmail } from '../services/emailService.js';

const db = new DbHelper(); // Instantiate DB Helper

// Register User
export const registerUser = async (req, res) => {
    // Validate request body
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password, location, role } = req.body;

    try {
        // Check if email already exists
        let results = await db.executeProcedure('AuthenticateUser', { Email: email });
        let existingUser = results.recordset[0];
        console.log('existingUser:', existingUser);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.executeProcedure('CreateUser', {
            Email: email,
            PasswordHash: hashedPassword,
            Location: location,
            Role: role,
        });

        res.status(201).json({ message: 'User registered successfully' });
        sendWelcomeEmail(email);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let results = await db.executeProcedure('AuthenticateUser', { Email: email });

      

        const user = results.recordset[0];

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.Password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Store user details in session
        req.session.authorized = true;
        req.session.user = user;
      

        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Logout User
export const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
};

// Update User Role
export const updateUserRole = async (req, res) => {
    const { userId, newRole } = req.body;

    try {
        await db.executeProcedure('UpdateUserRole', {
            UserId: userId,
            NewRole: newRole,
        });

        res.status(200).json({ message: 'User role updated successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export async function getAllUsers(req, res) {
    try {
    
      const results = await db.executeProcedure('GetAllUsers', {});
      let users = results.recordset;
     
      return res.status(200).json({
        success: true,
        Users: users
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve users'
      });
    }
  }

