import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler";




export const signupUser = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    console.log(req.body);
    if (!email) {
      return res.status(400).json({ message: "Email or password is missing" });
    }

    // Check if the user with the provided email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      // Create a new user
      const newUser = await prisma.user.create({
        data: {
          email: email,
        },
      });

      return res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    }
    else{
        res.status(200).json({
            message:"user already registered",existingUser
                });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUserLevel = asyncHandler(async (req, res) => {
  const { userId, points, exerciseId } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(existingUser);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        rewards: existingUser.rewards + points,
      },
    });

    const newVote = await prisma.vote.create({
      data: {
        userId: userId,
        exerciseId: exerciseId,
      },
    });

    console.log(newVote);
    return res.status(200).json(newVote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
