import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

async function middleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers["authorization"];
        if(!token) {
          res.status(401).json({ message: "Token missing" });
          return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        if(!decoded || !decoded.userId) {
          res.status(401).json({
            success: "Invalid token"
          })
        }
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
    next();
}

export default middleware;