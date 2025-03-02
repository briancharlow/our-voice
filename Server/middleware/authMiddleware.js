export const isAuthenticated = (req, res, next) => {
    const authorized = req.session?.authorized;
    if (!req.session.user || !authorized) {
        return res.status(401).json({ message: 'Unauthorized, please log in' });
    }
    next();
};

export const isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.Role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

export const isCitizen = (req, res, next) => {
    if (!req.session.user || req.session.user.Role !== 'Citizen') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

export const isGovernmentOfficial = (req, res, next) => {
    if (!req.session.user || req.session.user.Role !== 'Government Official') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};