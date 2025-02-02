import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import middleware from "./middleware";
import { userSchema, signInSchema, signUpSchema } from "@repo/common/types";
import { prisma } from "@repo/db/client";
import { JWT_SECRET } from "@repo/backend-common/config";
 
const app = express();
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
})

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
        token
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
})

// @ts-ignore
app.post("create-room", middleware, async (req: Request, res: Response) => {
    
})

app.listen(5555, () => {
  console.log("http server activated on port 3001")
});