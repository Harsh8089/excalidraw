import axios from "axios";
import { BACKEND_URL } from "@repo/common/config";
import { toolsType } from "@/components/Tools";

export type Shape = {
  type: "rect",
  x: number,
  y: number,
  width: number,
  height: number 
} | {
  type: "circle",
  centerX: number,
  centerY: number,
  radius: number
};

export async function getExistingShapes(
  roomId: string, 
): Promise<Shape[] | null> {
  const token = localStorage.getItem("token");
  if(!token) return null;

  try {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`, {
      headers: {
        "authorization": token
      }
    });
    
    const messages = res.data.chatMessages;
    const shapes: Shape[] = messages.map((shape: any) => {
      return JSON.parse(shape.message) as Shape;
    });
    return shapes;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function handleGame(
  canvas: HTMLCanvasElement, 
  roomId: string, 
  socket: WebSocket,
  toolSelected: toolsType,
  existingShapes: Shape[] 
) {
  if(!existingShapes) return () => {};

  const ctx = canvas.getContext("2d");
  if(!ctx) return () => {};

  clearCanvas(canvas, ctx);
  renderShapes(ctx, existingShapes);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if(data.type === 'chat') {
      const shape: Shape = JSON.parse(data.message);
    
      if(shape.type === 'rect') {
        ctx.strokeStyle = 'rgba(255, 255, 255)';
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }

      existingShapes.push(shape);
    }
  }
  
  let pressed = false;
  let startX = 0, startY = 0;

  const handleMouseDown = (event: MouseEvent) => {
    startX = event.clientX;
    startY = event.clientY;
    pressed = true;
  };

  const handleMouseUp = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    pressed = false;

    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width: x - startX,
      height: y - startY
    }
    console.log(shape);
    existingShapes.push(shape);

    socket.send(JSON.stringify({
      type: "chat",
      roomId,
      chatMessage: JSON.stringify(shape)
    }))
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (pressed) {
      const x = event.clientX;
      const y = event.clientY;
    
      clearCanvas(canvas, ctx);
      renderShapes(ctx, existingShapes);
      
      ctx.strokeStyle = 'rgba(255, 255, 255)';
      ctx.strokeRect(startX, startY, x - startX, y - startY);
    }
  };

  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('mousemove', handleMouseMove);

  return () => {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mouseup', handleMouseUp);
    canvas.removeEventListener('mousemove', handleMouseMove);
  };
};

function renderShapes(ctx: CanvasRenderingContext2D, shapes: Shape[]) {
  ctx.strokeStyle = 'rgba(255, 255, 255)';
  
  shapes.forEach(shape => {
    if(shape.type === 'rect') {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if(shape.type === 'circle') {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  });
}

function clearCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
