"use client";

import initGame from "@/draw/initGame";
import { useEffect, useRef } from "react";

export default function Canvas({
  roomId,
  socket
}: {
  roomId: string,
  socket: WebSocket
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initGame(canvas, roomId, socket);
    }
  }, [canvasRef]);

  return <canvas
    width={1000}
    height={1000}
    ref={canvasRef}
  > 
  </canvas>
}