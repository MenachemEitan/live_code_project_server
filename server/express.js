const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const webSocket = require('ws');
require('dotenv').config()
const WS_PORT = process.env.WS_PORT;
const APP_PORT = process.env.APP_PORT
const { Server } = require('http');
const DB = require('./lib/mongoController');
const { uuid } = require('uuidv4');

const codes = new DB("code")
const wsServer = new webSocket.Server({ server:server, path: "/session"})
wsServer.broadcast = function broadcast(msg) {
    console.log(`broadcasting   ${msg}` );
    wsServer.clients.forEach(function each(client) {
        client.send(msg);
     });
 }
let count = 0
wsServer.on('connection',async function connection(ws, req){
    ws.id =  uuid()
    console.log("ws.id ", ws.id);
    const myCode = await codes.getByName(req.url.split("=")[1])
    // console.log("my code ", myCode);
    console.log("new client connected");
    ws.send(myCode?.code);
    if (count <2){
        count++
    }
    console.log("open ", count)
    ws.on('message', function incoming(messageAsBuffer){
        const message = messageAsBuffer.toString()
        console.log(`received : ${message}`);
        wsServer.broadcast(message);
      
    }); 
    ws.on('close', function close(){
        if(count ===1 || count ===2){
            count = count-1
        }
        console.log(count);
    } ) 
});




app.use(express.json());

app.use(cors({
    origin:'*'
}))

app.get("/teacherOrStudent", (req, res)=>{
    res.status(200).send(`${count}`)
})
app.listen(APP_PORT, ()=>{
    console.log("server is listen on port 8080");
})

server.listen(WS_PORT, ()=>{
    console.log("ws is listen on port 4000");
})