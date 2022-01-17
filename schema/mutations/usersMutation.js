import User from "../../Models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const createUserResolver = async (parent, args, context) => {
    const user = await User.findOne({username: args.username})
    const user1 = await User.findOne({email: args.email})
    if(user) {
        throw new Error('Username taken')
    }
    else if(user1){
        throw new Error('Email already exists')
    }else{
        const user = await new User({
            username: args.username,
            email: args.email,
            password: args.password
        });
        const storeUser = await user.save()
        if (storeUser){
            const token = await jwt.sign({userId:user._id, username: user.username, email:user.email}, 'secret123',  {
                expiresIn: '24h'
            })
            await context.res.cookie('token', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            })
            const userDetails = await ({
                username: user.username,
                email: user.email,
                userId: user._id,
            });
            return userDetails
        }
    } 
}


export const loginResolver = async (parent, args, context) => {
    const user = await User.findOne({email: args.identity}) || await User.findOne({username: args.identity}) ;
    if (!user){
        throw new Error('Email or Username does not exist')
    }else{
        const isMatch = await bcrypt.compare(args.password, user.password);
        if (!isMatch) {
            throw new Error('Incorrect password')
        } else {
            const token = await jwt.sign({userId:user._id, username: user.username, email:user.email}, 'secret123', {
                expiresIn: '24h'
            })
            await context.res.cookie('token', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            })
            const userDetails = await ({
                username: user.username,
                email: user.email,
                userId: user._id,
            });
            return userDetails
        }
    }
}


export const authResolver = async (parent, args, request) => {
    const payload = jwt.verify(request.cookies.token, 'secret123');

    const userInfo = await User.findById(payload.userId)
    const userDetails = await ({
        username: userInfo.username,
        email: userInfo.email,
        userId: userInfo._id,
    });
    return userDetails
}