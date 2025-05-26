import express from 'express';
import { createUser, loginUser, refreshToken, logout, getCurrentUser } from '../controllers/auth.controller.js';
import { validateDTO } from '../middlewares/validation.middleware.js';
import { UserRequestDTO } from '../dtos/user.dto.js';
import { loginRateLimiter } from '../middlewares/rateLimit.middleware.js';
import { LoginRequestDTO } from '../dtos/auth.dto.js';
import { protect } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post('/register', validateDTO(UserRequestDTO), createUser);
router.post('/login', loginRateLimiter, validateDTO(LoginRequestDTO), loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', protect, getCurrentUser);

export default router;