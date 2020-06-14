const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Necesitas iniciar sesión para poder acceder');
    res.redirect('/users/signin');
};

module.exports = helpers;