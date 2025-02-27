import bcrypt from 'bcrypt';
import session from 'express-session';
import { DbHelper } from '../Database Helper/dbHelper.js';

const db = new DbHelper(); // Instantiate DB Helper

// Register User
export const registerUser = async (req, res) => {
    const { email, password, location, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password

        await db.executeProcedure('CreateUser', {
            Email: email,
            PasswordHash: hashedPassword,
            Location: location,
            Role: role,
        });

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let results = await db.executeProcedure('AuthenticateUser', { Email: email });

        const user = results[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.Password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Store user details in session
        req.session.user = { user };
        res.status(200).json({ message: 'Login successful', user: req.session.user });

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
