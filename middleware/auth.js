const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log('token expire')
            return res.status(401).json({ message: 'Token expired', expired: true });
        }
        else {
            console.error(error);
            res.status(403).json({ message: 'Invalid token' });
        }
    }
};

module.exports = auth