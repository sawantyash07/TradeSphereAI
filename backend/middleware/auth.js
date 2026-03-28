const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ status: 'error', message: 'Unauthorized. Please login first.' });
};

module.exports = { isAuthenticated };
