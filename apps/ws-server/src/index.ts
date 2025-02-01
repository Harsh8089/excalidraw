import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"; 
import { decode } from "punycode";

const wss = new WebSocketServer({ port: 5550 });

wss.on('connection', async (ws, request) => {
    const url = request.url;
    if(!url) return;

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const decoded = jwt.verify(token, "asdas") as JwtPayload;
    
    if(!decoded || !decoded.userId) {
        ws.close();
        return;
    }


    ws.send("valid user");
})