export const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized, please log in' });
    }
    next();
};

export const isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};
