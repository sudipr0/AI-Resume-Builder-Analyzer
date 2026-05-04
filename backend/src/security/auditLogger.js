import winston from 'winston';

/**
 * Enterprise Audit Logger.
 * Records sensitive actions (logins, role changes, data exports) for SOC2 compliance.
 */
const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'audit-log' },
  transports: [
    // In production, this would write to a secure, write-only S3 bucket or DataDog
    new winston.transports.File({ filename: 'logs/audit.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  auditLogger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export const logAudit = (action, userId, ipAddress, resource, metadata = {}) => {
  auditLogger.info({
    action,
    userId,
    ipAddress,
    resource,
    ...metadata
  });
};

export default auditLogger;
