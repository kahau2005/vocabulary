const jwt = require('jsonwebtoken');

class MiddlewareController {
    // Kiểm tra accessToken
    verifyToken(req, res, next) {
        const token = req.headers.authorization;
        if (token) {
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken, process.env.ACCESS_KEY, (err, user) => {
                if (err) {
                   return res.status(403).json("Token không hợp lệ!");
                }
                req.user = user;
                next();
            });
        } else {
                return res.status(401).json("Bạn chưa đăng nhập!");
        }
        
    }
}

module.exports = new MiddlewareController();
