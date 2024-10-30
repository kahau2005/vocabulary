
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const { json } = require('express');
const jwt = require('jsonwebtoken');
let refreshTokens = [];

class authController{
    async register(req, res){
        console.log(req.body.password);
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            
            const newUser = await new User({
                name : req.body.name,
                username: req.body.username,
                password: hashed
            });

            const user = await newUser.save();
            res.status(200).json(user);
        }catch(err){
            res.status(500).json(err);
        }
    }

    generateAccessToken(user){
        return jwt.sign({
            id: user.id,
            admin: user.admin
        }, process.env.ACCESS_KEY, {expiresIn: '30s'});
    }

    generateRefreshToken(user){
        return jwt.sign({
            id: user.id,
            admin: user.admin
        }, process.env.REFRESH_KEY, {expiresIn: '365d'});
    }

    getUserData = async (req, res) => {
        const userData = await User.findOne({username: req.body.username});
        if(userData){
            return res.status(200).json(userData);
        }else{
            return res.status(404).json('Wrong username');
        }
        
    }

    signIn = async (req, res) => {
        const user = await User.findOne({username: req.body.username});
        if(!user){
            return res.status(404).json('Wrong username!');
        }
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if(!validPassword){
            return res.status(404).json("Wrong password!");
        }
        if(user && validPassword){
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);
            refreshTokens.push(refreshToken);
            res.cookie('refreshToken', refreshToken,{
                httpOnly: true,
                path: '/',
                secure: false,
                sameSite: 'strict'
            });
            const {password, ...others} = user._doc;
            return res.status(200).json({...others, accessToken});
        }
    }

    requestRefreshToken = async(req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json('You are not authenticated!');
        if(!refreshTokens.includes(refreshToken)) return res.status(403).json('Refresh token is not valid!');

        jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, user) =>{
            if(err){
                console.log(err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            const newAccessToken = this.generateAccessToken(user);
            const newRefreshToken = this.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie('refreshToken', newRefreshToken,{
                httpOnly: true,
                path: '/',
                secure: false,
                sameSite: 'strict'
            });
            res.status(200).json({accessToken: newAccessToken});
        })
        
    }

    userLogout = async(req, res) => {
        res.clearCookie('refreshToken');
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json('Logged out!');
    }
}
module.exports = new authController;