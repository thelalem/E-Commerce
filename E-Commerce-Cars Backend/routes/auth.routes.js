import express from 'express';
import { createUser, loginUser } from '../controllers/auth.controller.js';
import { validateCreateUser, validateLogin } from '../middlewares/validate.middleware.js';


const router = express.Router();

router.post('/register', validateCreateUser, createUser);
router.post('/login', validateLogin, loginUser);

export default router;