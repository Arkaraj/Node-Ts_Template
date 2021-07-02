import express from "express";
const router = express.Router();
import passport from "passport";
import "../middlewares/isAuth";

const auth = passport.authenticate("jwt", { session: false });

import userController from "../controllers/user.controllers";

router.get("/", auth, userController.getUserProfile);

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.delete("/logout", auth, userController.logoutUser);

export default router;
