import express, { Request, Response } from "express";
import middleware from "./middleware";
import { userSchema, signInSchema, signUpSchema } from "@repo/common/types";
import { prisma } from "@repo/db/client";
 
const app = express();
app.use(express.json());

app.get("/health-check", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.post("/sign-up", async (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello" }); return;
})

app.post("/sign-in", async (req: Request, res: Response) => {
  try {
    const user = signInSchema.safeParse(req.body);
    
    if(user.success) {
      console.log(user);
    } else {
      res.status(400).json({
        message: "Invalid data format"
      });
      return;
    }
  } catch (error) {
      
  }
})

// @ts-ignore
app.post("create-room", middleware, async (req: Request, res: Response) => {
    
})

app.listen(5555, () => {
  console.log("http server activated on port 3001")
});