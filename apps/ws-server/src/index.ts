import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"; 
import { JWT_SECRET } from "@repo/backend-common/config"

const wss = new WebSocketServer({ port: 3002 });

type User = {
  rooms: string[],
  ws: WebSocket 
}

type Data = {
  type: 'join-room' | 'create-room' | 'leave-room' | 'chat',
  roomId: string,
  chatMessage?: string
}

const users: User[] = []

const checkValid = (token: string) : null | string => {
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  
  if(!decoded || !decoded.userdb.id) {
    return null;
  }

  return decoded.userdb.id;
}

wss.on('connection', async (ws, request) => {
  const url = request.url;
  if(!url) return;

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const user = checkValid(token);
  if(!user) {
    ws.close();
    return;
  }

  users.push({
    ws,
    rooms: []
  });


  ws.on('message', (message: string) => {
    try {
      const data: Data = JSON.parse(message);

      if(data.type === 'join-room') {
        const user = users.find(user => user.ws === ws);
        user?.rooms.push(data.roomId);
      }
      if(data.type === 'leave-room') {
        const user = users.find(user => user.ws === ws);
        if(!user) return;
        user.rooms = user?.rooms.filter(room => room === data.roomId)
      }
      if(data.type === 'chat') {
        users.forEach(user => {
          if(user.rooms.includes(data.roomId)) {
            user.ws.send(JSON.stringify({
              type: 'chat',
              message: data.chatMessage,
              roomId: data.roomId
            }));
          }
        });
      }

    } catch (error) {
      return null;
    }
  });
})
