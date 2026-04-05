// src/controllers/userController.js
import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id || req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.json({
        success: true,
        data: { user }
    });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id || req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.profile) {
        user.profile = { ...user.profile, ...req.body.profile };
    }

    const updatedUser = await user.save();

    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
    });
});

/**
 * @desc    Update user preferences
 * @route   PUT /api/users/preferences
 * @access  Private
 */
export const updateUserPreferences = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id || req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    user.preferences = { ...user.preferences, ...req.body.preferences };
    await user.save();

    res.json({
        success: true,
        message: 'Preferences updated successfully',
        data: { preferences: user.preferences }
    });
});

/**
 * @desc    Get user stats
 * @route   GET /api/users/stats
 * @access  Private
 */
export const getUserStats = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id || req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.json({
        success: true,
        data: { stats: user.stats || {} }
    });
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/users
 * @access  Private
 */
export const deleteAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id || req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // In a real app, you might want to soft-delete or perform cleanup
    user.isActive = false;
    user.isDeleted = true;
    await user.save();

    res.json({
        success: true,
        message: 'Account deleted successfully'
    });
});

/**
 * @desc    Upload user avatar
 * @route   POST /api/users/avatar
 * @access  Private
 */
export const uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const user = await User.findById(req.user.id || req.user._id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Save file path to user model (In production, use Cloudinary or S3 URL)
    user.avatar = `/uploads/profiles/${req.file.filename}`;
    await user.save();

    res.json({
        success: true,
        message: 'Avatar uploaded successfully',
        data: { avatar: user.avatar }
    });
});
