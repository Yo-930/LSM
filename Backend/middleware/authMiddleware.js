import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
    try{
        const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: 'Unauthorized User!'});
    }

    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
    if(!verifyToken){
        return res.status(401).json({message: 'Unauthorized User!'});
    }
    req.userId = verifyToken.id;
    next();
    }catch(error){
        return res.status(401).json({message: 'Invalid Token!'});
    }
}