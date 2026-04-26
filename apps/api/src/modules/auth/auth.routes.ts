import { Router } from 'express';
import { login, logout, me, refresh, register } from './auth.controller.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { loginSchema, registerSchema } from './auth.validation.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
