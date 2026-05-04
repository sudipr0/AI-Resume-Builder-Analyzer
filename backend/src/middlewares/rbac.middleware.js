/**
 * Role-Based Access Control (RBAC) Middleware
 * Enforces strict permission boundaries across the API.
 */

const roleHierarchy = {
  admin: 4,
  business: 3,
  pro: 2,
  free: 1
};

export const requireRole = (minimumRole) => {
  return (req, res, next) => {
    // Assuming req.user is populated via JWT middleware
    const userRole = req.user?.role || 'free';

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[minimumRole];

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `This action requires ${minimumRole} privileges or higher.`
      });
    }

    next();
  };
};

export const requireAdmin = requireRole('admin');
