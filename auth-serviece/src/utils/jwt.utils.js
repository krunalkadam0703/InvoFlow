import jwt from 'jsonwebtoken';

import ApiError from './appiError.utils.js';

const access_token_secrete = process.env.JWT_ACCESS_TOKEN_SECRETE;
const accessTokenExpiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN;
const refreshTokenSecrete = process.env.JWT_REFRESH_TOKEN_SECRETE;
const refreshTokenExpiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN;

export const generateAccessToken = (payload) => {
  if (!access_token_secrete || !accessTokenExpiresIn) {
    throw new ApiError(500, 'envioroment for jwt is not set properly');
  }
  return jwt.sign(payload, access_token_secrete, {
    expiresIn: accessTokenExpiresIn,
    algorithm: 'HS256',
  });
};

export const generateRefreshToken = (payload) => {
  if (!refreshTokenSecrete || !refreshTokenExpiresIn) {
    throw new ApiError(500, 'envioroment for jwt is not set properly');
  }
  return jwt.sign(payload, refreshTokenSecrete, {
    expiresIn: refreshTokenExpiresIn,
    algorithm: 'HS256',
  });
};

export const verifyAccessToken = (token) => {
  try {
    if (!access_token_secrete) {
      throw new ApiError(500, 'envioroment for jwt is not set properly');
    }

    return jwt.verify(token, access_token_secrete);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access token expired', ['Token has expired']);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid access token', [error.message]);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, 'Token verification failed', [error.message]);
  }
};

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
