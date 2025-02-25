import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your secret here';

//registering a new user

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Please Provide and Email, Password and Name' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      id: user.id,
      name: user.name,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.log('Error in Resister User Controller', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //finding the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.log('Error in Login Controller', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    //delete user

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete all related data (or you could use cascading deletes in Prisma schema)
    await prisma.set.deleteMany({
      where: {
        exercise: {
          workout: {
            userId: req.user.id,
          },
        },
      },
    });

    await prisma.exercise.deleteMany({
      where: {
        workout: {
          userId: req.user.id,
        },
      },
    });

    await prisma.workout.deleteMany({
      where: {
        userId: req.user.id,
      },
    });

    // Finally, delete the user
    await prisma.user.delete({
      where: {
        id: req.user.id,
      },
    });

    res.json({ message: 'User deleted successfully' });

    res.status(200).json('User Deleted');
  } catch (error) {
    console.log('Error in Delete User Controller', Error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};
