import jwt from 'jsonwebtoken'
import ApiError from './appiError.utils'

const access_token_secrete = process.env.JWT_ACCESS_TOKEN_SECRETE
const accessTokenExpiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
const refreshTokenSecrete = process.env.JWT_REFRESH_TOKEN_SECRETE
const refreshTokenExpiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN

export const generateAccessToken = (payload)=>{
   try {
     if (!access_token_secrete || !accessTokenExpiresIn){
         throw ApiError(500,"envioroment for jwt is not set properly")
     }
     return jwt.sign(payload, access_token_secrete,{expiresIn:accessTokenExpiresIn,
        algorithm:'HS256'
     })
   } catch (error) {
    throw error
    
   }
}

export const generateRefreshToken = ()=>{
    try {
        if (!refreshTokenSecrete || !refreshTokenExpiresIn){
            throw ApiError(500,"envioroment for jwt is not set properly")
        }
        return jwt.sign(payload, refreshTokenExpiresIn,{expiresIn:refreshTokenExpiresIn,algorithm:'HS256'})
      } catch (error) {
       throw error
       
      }
}



export const verifyAccessToken =(token)=>{
   try {
     if (!access_token_secrete){
         throw ApiError(500,"envioroment for jwt is not set properly")
     }
 
     return jwt.verify(token,access_token_secrete)
   }catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access token expired', ['Token has expired']);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid access token', [error.message]);
    }
    throw new ApiError(401, 'Token verification failed', [error.message]);
  }   
    
}

export const verifyRefreshToken = (token) => {
    try {
      const secret = process.env.JWT_REFRESH_SECRET;
  
      if (!secret) {
        throw new ApiError(500, 'JWT_REFRESH_SECRET is not configured');
      }
  
      return jwt.verify(token, secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Refresh token expired', ['Token has expired']);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError(401, 'Invalid refresh token', [error.message]);
      }
      throw new ApiError(401, 'Token verification failed', [error.message]);
    }
  };