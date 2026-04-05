import User from '../../models/User.js';
import AdminResume from '../models/AdminResume.js';
import AdminLog from '../models/AdminLog.js';

class UserController {
    // Get all users with pagination and filters
    static async getAllUsers(req, res) {
        try {
            const {
                page = 1,
                limit = 20,
                search = '',
                status,
                role,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            const query = {};

            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            if (status !== undefined) {
                query.isActive = status === 'active';
            }

            if (role) {
                query.role = role;
            }

            const skip = (parseInt(page) - 1) * parseInt(limit);
            const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

            const [users, total] = await Promise.all([
                User.find(query)
                    .select('-password')
                    .sort(sort)
                    .skip(skip)
                    .limit(parseInt(limit))
                    .lean(),
                User.countDocuments(query)
            ]);

            // Add resume count for each user
            const usersWithStats = await Promise.all(users.map(async (user) => {
                const resumeCount = await AdminResume.countDocuments({ userId: user._id });
                return { ...user, resumeCount };
            }));

            res.json({
                success: true,
                data: {
                    users: usersWithStats,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total,
                        pages: Math.ceil(total / parseInt(limit))
                    }
                }
            });
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch users.'
            });
        }
    }

    // Get user by ID
    static async getUserById(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findById(id).select('-password').lean();

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.'
                });
            }

            // Get user's resumes
            const resumes = await AdminResume.find({ userId: id })
                .sort({ updatedAt: -1 })
                .lean();

            // Get user's activity logs
            const activities = []; 

            res.json({
                success: true,
                data: {
                    user,
                    resumes,
                    activities
                }
            });
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user.'
            });
        }
    }

    // Get user statistics
    static async getUserStats(req, res) {
        try {
            const totalUsers = await User.countDocuments();
            const activeUsers = await User.countDocuments({ isActive: true });
            const verifiedUsers = await User.countDocuments({ isVerified: true });
            const newToday = await User.countDocuments({
                createdAt: {
                    $gte: new Date().setHours(0, 0, 0, 0)
                }
            });
            const inactiveUsers = await User.countDocuments({ isActive: false });

            // Weekly growth
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            const lastWeekCount = await User.countDocuments({
                createdAt: { $gte: lastWeek }
            });

            res.json({
                success: true,
                data: {
                    totalUsers,
                    activeUsers,
                    verifiedUsers,
                    newToday,
                    inactiveUsers,
                    weeklyGrowth: totalUsers - lastWeekCount
                }
            });
        } catch (error) {
            console.error('Get user stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user statistics.'
            });
        }
    }

    // Create user
    static async createUser(req, res) {
        try {
            const { name, email, password, role = 'user' } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email already exists.'
                });
            }

            const user = new User({
                name,
                email,
                password,
                role,
                isVerified: true
            });

            await user.save();

            // Log action
            await AdminLog.create({
                adminId: req.admin._id,
                adminEmail: req.admin.email,
                action: 'CREATE_USER',
                resource: 'users',
                resourceId: user._id,
                details: { name, email, role },
                ipAddress: req.ip
            });

            res.status(201).json({
                success: true,
                message: 'User created successfully.',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Create user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create user.'
            });
        }
    }

    // Update user
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            delete updates.password;

            const user = await User.findByIdAndUpdate(id, updates, { new: true });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.'
                });
            }

            // Log action
            await AdminLog.create({
                adminId: req.admin._id,
                adminEmail: req.admin.email,
                action: 'UPDATE_USER',
                resource: 'users',
                resourceId: id,
                details: updates,
                ipAddress: req.ip
            });

            res.json({
                success: true,
                message: 'User updated successfully.',
                data: user
            });
        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update user.'
            });
        }
    }

    // Delete user
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.'
                });
            }

            // Delete user's resumes first
            await AdminResume.deleteMany({ userId: id });

            // Delete user
            await User.findByIdAndDelete(id);

            // Log action
            await AdminLog.create({
                adminId: req.admin._id,
                adminEmail: req.admin.email,
                action: 'DELETE_USER',
                resource: 'users',
                resourceId: id,
                details: { name: user.name, email: user.email },
                ipAddress: req.ip
            });

            res.json({
                success: true,
                message: 'User and associated data deleted successfully.'
            });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete user.'
            });
        }
    }

    // Update user status
    static async updateUserStatus(req, res) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;

            const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.'
                });
            }

            // Log action
            await AdminLog.create({
                adminId: req.admin._id,
                adminEmail: req.admin.email,
                action: isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
                resource: 'users',
                resourceId: id,
                ipAddress: req.ip
            });

            res.json({
                success: true,
                message: `User ${isActive ? 'activated' : 'deactivated'} successfully.`,
                data: user
            });
        } catch (error) {
            console.error('Update status error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update user status.'
            });
        }
    }
}

export default UserController;