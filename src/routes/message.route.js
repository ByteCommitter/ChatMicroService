import express from "express";
import { getUsersForSidebar, createSession } from "../controllers/message.controller.js";

const router=express.Router();

///chat/messages:
//these are non-real time endpoints:

//display all messages:
//router.get("/:sessionId",authenticateParticipant,getMessages);

router.get("/sessions",getUsersForSidebar); 
//The bunch of chat room Id's we're talking to

//send a message to the sessionId(chat Room Id)
// router.post("/send/:sessionId",authenticateParticipant,sendMessage);

router.post("/createSession",createSession);

export default router;

//realtime endpoints to be made with socket.io, and it would also store those messages on redis