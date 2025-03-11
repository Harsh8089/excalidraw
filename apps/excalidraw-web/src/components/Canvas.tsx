"use client";

import { 
handleGame,
getExistingShapes,
Shape
} from "@/draw/game";
import { useEffect, useRef, useState } from "react";
import Tools from "./Tools";
import { toolsType } from "./Tools";

export default function Canvas({
  roomId,
  socket
}: {
  roomId: string,
  socket: WebSocket
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [toolSelected, setToolSelected] = useState<toolsType>("rect");
  const [existingShapes, setExistingShapes] = useState<Shape[]>([]);
  
  useEffect(() => {
    getExistingShapes(roomId).then((data) => {
      if(data) setExistingShapes(data);
    });
  }, [])
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      console.log(existingShapes);
      const cleanUp = handleGame(canvas, roomId, socket, toolSelected, existingShapes);
      return () => cleanUp();
    }
  }, [toolSelected, existingShapes]);

  return <div className="overflow-hidden relative">
    <canvas
      ref={canvasRef}
      className="w-[100vw] h-[100vh]"
    > 
    </canvas>
    <Tools 
      setToolSelected={setToolSelected} 
      toolSelected={toolSelected}
    />
  </div>
}