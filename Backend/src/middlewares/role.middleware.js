export const requireRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };

export const requireTenant = (req, res, next) => {
  if (!req.user?.tenant) {
    return res.status(403).json({
      success: false,
      message: "Tenant workspace is required for this action",
    });
  }

  next();
};

export default {
  requireRoles,
  requireTenant,
};
