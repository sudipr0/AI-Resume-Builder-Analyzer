import AdminService from '../services/AdminService.js';
import AdminLog from '../models/AdminLog.js';

class AdminController {
    // Get all admins
    static async getAllAdmins(req, res) {
        try {
            const { page = 1, limit = 20, search, role, isActive } = req.query;
            const filters = { search, role, isActive };
            
            const result = await AdminService.getAllAdmins(filters, parseInt(page), parseInt(limit));
            
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Get all admins error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch admins'
            });
        }
    }

    // Get admin by ID
    static async getAdminById(req, res) {
        try {
            const { id } = req.params;
            const admin = await AdminService.getAdminById(id);
            
            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }
            
            res.json({
                success: true,
                data: admin
            });
        } catch (error) {
            console.error('Get admin by ID error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch admin'
            });
        }
    }

    // Create new admin
    static async createAdmin(req, res) {
        try {
            const admin = await AdminService.createAdmin(req.body);
            
            // Log action
            await AdminLog.create({
                adminId: req.admin._id,
                adminEmail: req.admin.email,
                action: 'CREATE_ADMIN',
                resource: 'admins',
                resourceId: admin._id,
                details: { email: admin.email, role: admin.role },
                ipAddress: req.ip
            });
            
            res.status(201).json({
                success: true,
                message: 'Admin created successfully',
                data: admin
            });
        } catch (error) {
            console.error('Create admin error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to create admin'
            });
        }
    }

    // Update admin
    static async updateAdmin(req, res) {
        try {
            const { id } = req.params;
            const admin = await AdminService.updateAdmin(id, req.body, req.admin);
            
            // Log action
            await AdminLog.create({
                adminId: req.admin._id,
                adminEmail: req.admin.email,
                action: 'UPDATE_ADMIN',
                resource: 'admins',
                resourceId: id,
                details: Object.keys(req.body),
                ipAddress: req.ip
            });
            
            res.json({
                success: true,
                message: 'Admin updated successfully',
                data: admin
            });
        } catch (error) {
            console.error('Update admin error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to update admin'
            });
        }
    }

    // Delete admin
    static async deleteAdmin(req, res) {
        try {
            const { id } = req.params;
            const result = await AdminService.deleteAdmin(id, req.admin._id);
            
            // Log action
            await AdminLog.create({
                adminId: req.admin._id,
                adminEmail: req.admin.email,
                action: 'DELETE_ADMIN',
                resource: 'admins',
                resourceId: id,
                ipAddress: req.ip
            });
            
            res.json({
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Delete admin error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to delete admin'
            });
        }
    }

    // Update admin status
    static async updateAdminStatus(req, res) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;
            const admin = await AdminService.updateAdminStatus(id, isActive);
            
            // Log action
            await AdminLog.create({
                adminId: req.admin._id,
                adminEmail: req.admin.email,
                action: isActive ? 'ACTIVATE_ADMIN' : 'DEACTIVATE_ADMIN',
                resource: 'admins',
                resourceId: id,
                ipAddress: req.ip
            });
            
            res.json({
                success: true,
                message: `Admin ${isActive ? 'activated' : 'deactivated'} successfully`,
                data: admin
            });
        } catch (error) {
            console.error('Update admin status error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to update admin status'
            });
        }
    }

    // Get admin stats
    static async getAdminStats(req, res) {
        try {
            const stats = await AdminService.getAdminStats();
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Get admin stats error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch admin statistics'
            });
        }
    }
}

export default AdminController;
