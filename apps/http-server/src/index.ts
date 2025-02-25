import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";

import middleware from "./middleware";
import { userSchema, signInSchema, signUpSchema, createRoomSchema } from "@repo/common/types";
import { prisma } from "@repo/db/client";
import { JWT_SECRET } from "@repo/backend-common/config";
 
const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.get("/health-check", (req: Request, res: Response) => {
  res.json({
    status: "ok"
  });
  return;
});

app.post("/sign-up", async (req: Request, res: Response) => {
  try {
    const user = signUpSchema.safeParse(req.body);

    if(user.success) {
      const userdb = await prisma.user.findFirst({
        where: {
          username: user.data.username
        },
        select: {
          id: true,
          username: true,
        }
      });

      if(userdb) {
        res.status(409).json({
          message: "User already exists"
        })
        return;
      }

      // hash pswd
      const userCreated = await prisma.user.create({
        data: {
          username: user.data.username,
          password: user.data.password
        }
      })

      res.status(200).json({
        user: userCreated
      });
      return;
    } else {
      res.status(400).json({
        message: "Invalid data format"
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
    return;
  }
});

app.post("/sign-in", async (req: Request, res: Response) => {
  try {
    const user = signInSchema.safeParse(req.body);
    
    if(user.success) {
      const userdb = await prisma.user.findFirst({
        where: {
          username: user.data.username
        },
        select: {
          id: true,
          username: true,
        }
      });

      if(!userdb) {
        res.status(404).json({
          message: "User not found"
        })
        return;
      }
      
      const token = jwt.sign({
        userdb
      }, JWT_SECRET);

      res.status(200).json({
        token,
        userId: userdb.id
      });
      return;
    } else {
      res.status(400).json({
        message: "Invalid data format"
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
    return;
  }
});

// @ts-ignore
app.post("/room", middleware, async (req: Request, res: Response) => {
  try {
    const parsedData = createRoomSchema.safeParse(req.body);
    if(parsedData.success) {
      
      const roomdb = await prisma.room.findFirst({
        where: {
          slug: parsedData.data.slug
        }
      });
      
      if(roomdb) {
        res.status(409).json({
          message: "Room already exists"
        });
        return;
      }

      const roomCreated = await prisma.room.create({
        data: {
          // @ts-ignore
          adminId: parseInt(req.id),
          slug: parsedData.data.slug,
        }
      });

      res.status(200).json({
        message: "Room created successfully",
        roomCreated
      });
      return;
    } else  {
      res.status(400).json({
        message: "Invalid data format"
      });
      return;
    }    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error"
    });
    return;
  }
});

app.get("/chats/:roomId", middleware, async (req: Request, res: Response) => {
  const roomId = req.params.roomId ?? "";
  console.log(roomId);
  try {
    const chatMessages = await prisma.chat.findMany({
      where: {
        roomId: parseInt(roomId)
      },
      orderBy: {
        id: "desc"
      },
      take: 50,
      select: {
        id: true,
        userId: true,
        message: true,
      }
    });

    console.log(chatMessages);

    res.status(200).json({
      chatMessages
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error
    });
    return;
  }
});

app.listen(3001, () => {
  console.log("http server activated on port 3001")
});