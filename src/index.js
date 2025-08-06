import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

//uncomment when moving to sockets
//import {app,server} from "./lib/socket.js";


const app=express();


const PORT= process.env.PORT;


//TODO : Fix this in prod:
app.use(cors({
  origin: '*', // During development you can use * but restrict this in production
  methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.get("/health",(req,res)=>{
    res.status(200).json({status:"ok"});
})

app.use("/chat/auth",authRoutes);
app.use("/chat/message",messageRoutes);

//change to server, when moving to sockets...
app.listen(PORT,()=>{
    console.log(`Server is running on PORT: ${PORT}`);
});
