import User from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { generateToken } from '../utils/jwt.js';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password, fullName });
    const token = generateToken(user._id);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ 
        message: 'User registered successfully',
        success: true,
        user 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const logoutUser = (req, res) => {
  res
    .cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    })
    .status(200)
    .json({ message: 'Logged out successfully' });
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, website } = req.body;

    // Find user by ID from the authenticated req.user object
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          fullName,
          bio,
          website,
        },
      },
      { new: true } // Return the updated document
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const changeProfilePhoto = async (req, res) => {
  try {
    const localPath = req.file?.path;
    if (!localPath) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const cloudinaryResponse = await uploadOnCloudinary(localPath);
    if (!cloudinaryResponse?.secure_url) {
      return res.status(500).json({ message: 'Failed to upload image' });
    }

    // Update the user's profilePicture field with the URL string
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          profilePicture: cloudinaryResponse.secure_url,
        },
      },
      { new: true }
    ).select('-password');

    return res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully',
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};  

export const changeProfileStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle the boolean status
    user.isPrivate = !user.isPrivate;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: `Profile status updated to ${user.isPrivate ? 'Private' : 'Public'}`,
      isPrivate: user.isPrivate,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};