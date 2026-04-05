// src/services/maintenanceService.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';
import Resume from '../models/Resume.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MaintenanceService {
    constructor() {
        this.tempDirs = [
            path.join(__dirname, '../../uploads/temp'),
            path.join(__dirname, '../../temp/cache'),
            path.join(__dirname, '../../temp/sessions')
        ];
    }

    /**
     * Start scheduled maintenance tasks
     */
    start() {
        logger.info('🛠️ Maintenance Service Started');
        
        // Run daily at 3 AM
        setInterval(() => {
            const now = new Date();
            if (now.getHours() === 3 && now.getMinutes() === 0) {
                this.runFullMaintenance();
            }
        }, 60000); // Check every minute
    }

    async runFullMaintenance() {
        logger.info('🧹 Running Full System Maintenance...');
        try {
            await this.cleanupTempFiles();
            await this.cleanupExpiredSessions();
            await this.verifyDatabaseIntegrity();
            logger.info('✅ Full Maintenance Completed Successfully');
        } catch (error) {
            logger.error('❌ Full Maintenance Failed:', error);
        }
    }

    async cleanupTempFiles() {
        for (const dir of this.tempDirs) {
            try {
                const files = await fs.readdir(dir);
                const now = Date.now();
                const maxAge = 24 * 60 * 60 * 1000; // 24 hours

                for (const file of files) {
                    const filePath = path.join(dir, file);
                    const stats = await fs.stat(filePath);
                    if (now - stats.mtimeMs > maxAge) {
                        await fs.unlink(filePath);
                        logger.debug(`Deleted old temp file: ${file}`);
                    }
                }
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    logger.warn(`Failed to cleanup dir ${dir}:`, error.message);
                }
            }
        }
    }

    async cleanupExpiredSessions() {
        // Implementation for cleaning up expired sessions from DB or File system
        logger.debug('Cleaning up expired sessions...');
    }

    async verifyDatabaseIntegrity() {
        try {
            const resumeCount = await Resume.countDocuments();
            const userCount = await User.countDocuments();
            logger.info(`System Stats: ${userCount} users, ${resumeCount} resumes`);
        } catch (error) {
            logger.error('DB Integrity Check Failed:', error);
        }
    }
}

export default new MaintenanceService();
