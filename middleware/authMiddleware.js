// exports.ensureAuthenticated = (req, res, next) => {
//     if (req.session.user) {
//          return next();
//     }
//     res.redirect('/signup');
// }

// exports.ensureFarmer = (req, res, next) => {
//     if(req.session.user && req.session.user.role === 'farmer') {
//         return next();
//     }
//     res.redirect('/');
// }



// middleware/authMiddleware.js
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.redirect('/login');
};

exports.ensureRole = (roleName) => {
  return (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated() && req.user && req.user.userFRole === roleName) {
      return next();
    }
    return res.redirect('/login');
  };
};

// Convenience wrappers if you want them
exports.ensureFarmer = exports.ensureRole('Farmer');
exports.ensureSalesRep = exports.ensureRole('SalesRep');
exports.ensureBrooderManager = exports.ensureRole('BrooderManager');

