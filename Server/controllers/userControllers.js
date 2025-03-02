import bcrypt from 'bcrypt';
import session from 'express-session';
import { DbHelper } from '../Database Helper/dbHelper.js';
import crypto from "crypto";
import {validateUser } from '../validators/validators.js';
import { sendWelcomeEmail, sendResetPasswordEmail } from '../services/emailService.js';

const db = new DbHelper(); // Instantiate DB Helper

// Register User
export const registerUser = async (req, res) => {
    // Validate request body
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password, location } = req.body;

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
            Role: 'Citizen',
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
  export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        let results = await db.executeProcedure("AuthenticateUser", { Email: email });
        let user = results.recordset[0];

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate reset token (plain text)
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Set token expiration (1 hour)
        const expirationTime = new Date(Date.now() + 3600000);

        // Store reset token (PLAIN) in database
        await db.executeProcedure("SetResetToken", {
            Email: email,
            ResetToken: resetToken,  // Store plain token now
            Expiry: expirationTime,
        });

        // Send password reset email
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        await sendResetPasswordEmail(email, resetUrl);

        res.json({ message: "Password reset email sent" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    console.log('Token Received:', token);

    try {
        console.log("Token Received:", token);

        // Retrieve user by reset token (no need to hash now)
        let results = await db.executeProcedure("GetUserByResetToken", { ResetToken: token });
        let user = results.recordset[0];

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        // Check if the reset token is expired
        const currentTime = new Date();
        const tokenExpiry = new Date(user.ResetTokenExpiry);

        if (tokenExpiry < currentTime) {
            return res.status(400).json({ error: "Token has expired" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password using stored procedure
        await db.executeProcedure("UpdatePassword", {
            Email: user.Email,
            NewPassword: hashedPassword,
        });

        res.json({ message: "Password reset successfully" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
