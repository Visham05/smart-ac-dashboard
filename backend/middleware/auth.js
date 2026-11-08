
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    try {
        // Read JWT from the HTTP-only cookie
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please sign in to continue"
            });
        }

        // Verify token using the secret key
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach authenticated user's ID to request
        req.user = {
            userId: decoded.userId
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Your session is invalid or expired. Please sign in again."
        });
    }
}

module.exports = authenticateToken;
