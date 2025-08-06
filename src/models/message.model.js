export default class Message{
    constructor(fromId,sessionId,text,time){
        this.fromId=fromId;
        this.sessionId=sessionId;
        this.text=text;
        this.time=time;
    }
}