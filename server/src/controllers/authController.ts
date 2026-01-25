import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';

const generateToken = (id: string) => {
    return jwt.sign({ id }, "dev_super_secret123" as string, {
        expiresIn: '30d'
    });
};

// @desc Register new user
// @route POST /api/auth/register
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            passwordHash
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            res.status(400).json({
                message: 'Invalid user data'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: (error as Error).message
        });
    }
}

// @desc Authentivate a user
// @route POST /api/auth/login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: (error as Error).message
        });
    }
};

//@desc Get user profile
// @route GET /api/auth/profile

export const getUserProfile = async (req: any, res: Response): Promise<void> => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email
        });
    } else {
        res.status(404).json({
            message: 'User not found'
        });
    }
}