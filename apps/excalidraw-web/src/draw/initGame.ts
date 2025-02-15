export default function initGame(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if(!ctx) return;

  ctx.fillStyle = 'rgba(0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let pressed = false;
  let startX = 0, startY = 0;

  const handleMouseDown = (event: MouseEvent) => {
    startX = event.clientX;
    startY = event.clientY;
    pressed = true;
  };

  const handleMouseUp = (event: MouseEvent) => {
    pressed = false;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (pressed) {
      const x = event.clientX;
      const y = event.clientY;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
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