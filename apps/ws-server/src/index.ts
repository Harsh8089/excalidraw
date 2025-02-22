import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"; 
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";

const wss = new WebSocketServer({ port: 3002 });

type User = {
  rooms: number[],
  ws: WebSocket,
  userId: string
}

// create room logic is handled by http-backend
type Data = {
  type: 'join-room' | 'leave-room' | 'chat',
  roomId: number,
  chatMessage?: string
}

const users: User[] = []

const checkValid = (token: string) : null | string => {
  if (!token.trim()) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  
    if(!decoded || !decoded.userdb.id) {
      return null;
    }
    return decoded.userdb.id;
  } catch (error) {
    console.log(error);
  }
  return null;
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
    rooms: [],
    userId: user
  });

  ws.on('message', async (message: string) => {
    try {
      const data: Data = JSON.parse(message);

      if(data.type === 'join-room') {
        try {
          const roomdb = await prisma.room.findFirst({
            where: {
              id: Number(data.roomId)
            }
          });
          if(!roomdb) return;
        } catch (error) {
          console.log(error);
          return;
        }

        const user = users.find(user => user.ws === ws);
        if(!user?.rooms.includes(Number(data.roomId))) user?.rooms.push(data.roomId);
      }
      if(data.type === 'leave-room') {
        const user = users.find(user => user.ws === ws);
        if(!user) return;
        user.rooms = user?.rooms.filter(room => room === data.roomId)
      }
      if(data.type === 'chat') {
        try {
          await prisma.chat.create({
            data: {
              roomId: Number(data.roomId),
              userId: Number(user),
              message: data.chatMessage ?? ""
            }
          });
        } catch (error) {
          console.log(error);
          return;
        }

        users.forEach(user => {
          if(user.rooms.includes(data.roomId) && user.ws !== ws) {
            user.ws.send(JSON.stringify({
              type: 'chat',
              message: data.chatMessage,
              roomId: data.roomId,
              userId: user.userId
            }));
          }
        });
      }

    } catch (error) {
      console.log(error);
      return null;
    }
  });
})
