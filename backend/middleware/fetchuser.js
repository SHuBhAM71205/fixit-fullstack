const jwt= require('jsonwebtoken');
require('dotenv').config();
const JWT_secret = process.env.JWT_SECRET;


fetchUser = (req, res, next) => {
    const token = req.header('auth-token'); 
    if (!token) {
        return res.status(401).json({ error: 'Access denied, unauthorized' });
    }

    try {
        jwt.verify(token, JWT_secret);
        
        const data = jwt.decode(token);
        req.user = { ...(req.user || {}), ...data.user };
        console.log("verified", req.user); 
    } catch (error) {
        return res.status(400).json({ error: 'Unauthorized access' });
    }
    next();
}


module.exports = fetchUser;