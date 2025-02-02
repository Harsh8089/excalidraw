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
        console.log(decoded);
        if(!decoded || !decoded.userdb.id) {
          res.status(401).json({
            success: "Invalid token"
          });
          return;
        }

        // @ts-ignore
        req.id = decoded.userdb.id;        
    } catch (error) {
        res.status(500).json({ message: "server error" });
        return;
    }
    next();
}

export default middleware;