import express from "express";
import {connectServer} from '../controllers/auth.controller.js';

const router =express.Router()

router.post("/connectServer",connectServer);

export default router;
