import jwt from 'jsonwebtoken'

const Auth = async (req, res, next) => {
    const aheader = req.get('Authorization');
    if (!aheader){
        req.isAuth = false;
        return next();
    }
    const token = aHeader.split(' ')[1];
    if(!token || token === ''){
        req.isAuth = false;
        return next();
    }
    try{
        const decodedToken = await jwt.verify(token, 'secret123');
    } catch(err){
        req.isAuth = false;
        return next();
    }
    if (!decodedToken){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
    
}

export default Auth