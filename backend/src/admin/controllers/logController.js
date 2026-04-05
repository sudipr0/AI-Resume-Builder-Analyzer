import LogService from '../services/LogService.js';

class LogController {
    // Get all activity logs
    static async getLogs(req, res) {
        try {
            const { 
                page = 1, 
                limit = 50, 
                adminEmail, 
                action, 
                resource, 
                status, 
                startDate, 
                endDate 
            } = req.query;
            
            const filters = { 
                adminEmail, 
                action, 
                resource, 
                status, 
                startDate, 
                endDate 
            };
            
            const result = await LogService.getLogs(filters, parseInt(page), parseInt(limit));
            
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Get logs error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch activity logs'
            });
        }
    }

    // Get log statistics
    static async getLogStatistics(req, res) {
        try {
            const { days = 30 } = req.query;
            const stats = await LogService.getLogStatistics(parseInt(days));
            
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Get log stats error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch log statistics'
            });
        }
    }

    // Export logs to file
    static async exportLogs(req, res) {
        try {
            const { format = 'csv', ...filters } = req.query;
            const exportData = await LogService.exportLogs(filters, format);
            
            // Set appropriate headers for file download
            const filename = `admin_logs_${new Date().toISOString().split('T')[0]}.${format}`;
            res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            
            res.send(exportData);
        } catch (error) {
            console.error('Export logs error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to export logs'
            });
        }
    }

    // Clear old logs (manual action)
    static async clearOldLogs(req, res) {
        try {
            const { days = 90 } = req.body;
            const result = await LogService.clearOldLogs(parseInt(days));
            
            // Log the clear action
            await LogService.createActionLog(req.admin._id, 'logs_cleared', {
                adminEmail: req.admin.email,
                daysThreshold: days,
                deletedCount: result.deletedCount
            });
            
            res.json({
                success: true,
                message: `Successfully cleared ${result.deletedCount} logs older than ${days} days`,
                data: result
            });
        } catch (error) {
            console.error('Clear logs error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to clear old logs'
            });
        }
    }
}

export default LogController;
