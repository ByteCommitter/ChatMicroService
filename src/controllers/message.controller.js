import Redis from 'ioredis'
import Message from '../models/message.model.js';
import dotenv from 'dotenv';
dotenv.config();


const client = new Redis(process.env.REDIS_URL);

// Enable debug events
// client.on('connect', () => console.log('✅ Connected'));
// client.on('ready', () => console.log('✅ Ready'));
// client.on('error', (err) => console.log('❌ Error:', err));
// client.on('close', () => console.log('⚠️ Closed'));
// client.on('reconnecting', () => console.log('🔄 Reconnecting'));

// await client.connect();
// console.log('Connection state:', client.status);

// const info = await client.info('server');
// console.log('=== CHAT SERVER REDIS INFO ===');
// console.log(info.substring(0, 500));
// export const getUsersForSidebar= async(req,res)=>{
//     try{
//         const loggedInUserId=req.user._id;
//         const filteredUser= await User.find({_id:{$ne:loggedInUserId}});

//         res.status(200).json(filteredUser);
//     }
//     catch(error){
//         console.error("error in Getting Users",error.message);
//         res.status(500).json({"message":"Internal Server Error"});
//     }   
// }

// export const getMessages= async(req,res)=>{
//     try{
//         const {id:userToChatId}=req.params;
//         const senderId=req.user._id;
//         console.log(`${userToChatId} is the person we're speaking to\nI am ${senderId}`);
//         const messages= await Message.find({
//             $or:[
//                 {senderId:senderId, recieverId:userToChatId},
//                 {senderId:userToChatId,recieverId:senderId}
//             ]
//         });
//         res.status(200).json(messages);
//     }
//     catch(err){
//         console.log("Unable to retrieve messages ",err);
//         res.status(500).json({error:"Internal Server Error"});
//     }
// }

// export const sendMessage=async(req,res)=>{
//     try{
//         const {text,image} =req.body;
//         const {id:recieverId}= req.params;

//         const senderId=req.user._id;
        
//         let imageUrl;

//         const newMessage= new Message({
//             senderId,
//             recieverId,
//             text,
//             image:imageUrl
//         })

//         await newMessage.save();
//         res.status(201).json(newMessage);
//     }
//     catch(error){
//         console.log("Error sending message ",error);
//         res.status(500).json({message:"Internal Server Error"});
//     }
// }


export const getUsersForSidebar = async(req,res)=>{
    const id = req
};


export const createSession=async(req,res)=>{
    try{
        const {roomName,roomSessionId,participants}= req.body;
        //post the session Room details to chat microservice using axios
        

        //user can't set the same roomName for two sessions
        const roomNameExists= await client.exists(`roomName:${roomName}`);
        if(roomNameExists){
            console.log("Can't create room with same name");
            return res.status(409).json({message:"Can't create room with same name"});
        }
        console.log("Creating new Room");
        //set metadata for roomName
        await client.hset(`roomName:${roomName}`,{
            sessionId:roomSessionId,
            participants:JSON.stringify(participants)
        });

        console.log("Created Room Metadata");
        
        //set messages hash for sessionId
        const firstMessage= new Message({},{},{},{});
        await client.rpush(`${roomSessionId}:messages`,JSON.stringify(firstMessage));

        console.log("Pushed first Message into messages");
        
        //for all participants add this sessionId
        for(let i=0;i<participants.length;i++){
            const participantId=participants[i].id,participantName=participants[i].name;
            await client.rpush(`${participantId}@${participantName}:sessions`,JSON.stringify(roomSessionId));
        }
        
        const TTL= 7*24*3600;
        await client.expire(`${roomSessionId}:messages`,TTL);
        await client.expire(`roomName:${roomName}`,TTL);

        res.status(201).json({message:"Created room with participants"});
    }
    catch(error){
        console.log("Unable to create room : ",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
};