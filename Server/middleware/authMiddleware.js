import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized, please log in' });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        
        // Add user info to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized, please log in' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied' });
    }
};

export const isCitizen = (req, res, next) => {
    if (req.user && req.user.role === 'Citizen') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied' });
    }
};

export const isGovernmentOfficial = (req, res, next) => {
    if (req.user && req.user.role === 'Government Official') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied' });
    }
};