const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
let refreshTokens = [];

class authController {
    // Hàm đăng ký người dùng
    async register(req, res) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            const newUser = await new User({
                name: req.body.name,
                username: req.body.username,
                password: hashed
            });

            const user = await newUser.save();
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    // Tạo access token
    generateAccessToken(user) {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        }, process.env.ACCESS_KEY, { expiresIn: '4h' });
    }

    // Tạo refresh token
    generateRefreshToken(user) {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        }, process.env.REFRESH_KEY, { expiresIn: '365d' });
    }

    // Đăng nhập người dùng
    signIn = async (req, res) => {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).json('Sai tên đăng nhập!');
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(404).json("Sai mật khẩu!");
        }

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        // Lưu refreshToken vào cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/',
            secure: false,  // Thay 'false' bằng 'true' nếu sử dụng HTTPS
            sameSite: 'strict'
        });

        const { password, ...others } = user._doc;
        return res.status(200).json({ ...others, accessToken });
    }

    // Làm mới accessToken bằng refreshToken
    requestRefreshToken = async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json('Bạn chưa được xác thực!');

        if (!refreshTokens.includes(refreshToken)) return res.status(403).json('Refresh token không hợp lệ!');

        jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, user) => {
            if (err) {
                return res.status(403).json('Lỗi xác thực refresh token');
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            const newAccessToken = this.generateAccessToken(user);
            const newRefreshToken = this.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                path: '/',
                secure: false,  // Thay 'false' bằng 'true' nếu sử dụng HTTPS
                sameSite: 'strict'
            });

            res.status(200).json({ accessToken: newAccessToken });
        });
    }

    // Đăng xuất người dùng
    userLogout = async (req, res) => {
        res.clearCookie('refreshToken');
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json('Đăng xuất thành công!');
    }
}

module.exports = new authController();
