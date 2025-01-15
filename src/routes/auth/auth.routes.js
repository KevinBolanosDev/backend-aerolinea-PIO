import { Router } from "express";
import { authRequired } from "../../middlewares/validateToken.js";
import { login, logout, register, verifyToken } from "../../controllers/auth/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/verify", authRequired, verifyToken);

export default router;
