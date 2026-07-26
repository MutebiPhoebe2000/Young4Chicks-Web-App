exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Not authenticated' });
};

exports.ensureRole = (roleName) => {
  return (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated() && req.user && req.user.userFRole === roleName) {
      return next();
    }
    return res.status(401).json({ error: 'Not authenticated' });
  };
};

exports.ensureFarmer = exports.ensureRole('Farmer');
exports.ensureSalesRep = exports.ensureRole('SalesRep');
exports.ensureBrooderManager = exports.ensureRole('BrooderManager');
