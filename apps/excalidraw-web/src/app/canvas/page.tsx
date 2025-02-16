"use client";

import initGame from "../../draw/initGame";
import { useEffect, useRef } from "react";
import useSocket from "../../hooks/useSocket";
import { SOCKET_URL } from "@repo/common/config";

const Canvas = () => {
  const roomId = "1";

  const token = localStorage.getItem("token");
  if(!token) return <div>
    Token Not found...
  </div>

  const { socket, loader } = useSocket(`${SOCKET_URL}?token=${localStorage.getItem("token")}`);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && socket && !loader) {
      socket?.send(JSON.stringify({
        type: "join-room",
        roomId
      }));
      
      initGame(canvas, roomId, socket);
    }
  }, [canvasRef, socket, loader]);

  return <>
    {loader ? (
        <div>Loading </div>
      ) : (
        <canvas
          width={1000}
          height={1000}
          ref={canvasRef}
        > 
        </canvas>
    )}
  </>
    
} 

export default Canvas;