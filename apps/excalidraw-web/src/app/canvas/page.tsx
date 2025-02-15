"use client";

import initGame from "@/draw/initGame";
import { useEffect, useRef, useState } from "react";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initGame(canvas);
    }
  }, [canvasRef]);

  return <canvas
      width={1000}
      height={1000}
      ref={canvasRef}
    > 
    </canvas>
    
} 

export default Canvas;