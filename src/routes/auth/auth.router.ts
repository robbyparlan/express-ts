import { Router } from "express";
import {AuthController} from "../../controllers/auth.controller";
import { asyncHandler } from "../../utils/util";

const authController = new AuthController()
let router = Router();

// Use asyncHandler to wrap the controller method
router.post('/login', asyncHandler(authController.HandleLogin.bind(authController)));

export = router;