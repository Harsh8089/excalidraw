"use client";

import { useEffect, useState } from "react";

const SOCKET_URI = "ws://localhost:5550";

function useSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(SOCKET_URI);

    ws.onopen = () => {
      setSocket(ws);
    }

    return () => {
      ws.close = () => {
        setSocket(null);
      };
    }
  }, []);

  return socket;
}

export default function Home() {
  const socket = useSocket();

  if (socket) {
    socket.onmessage = (message) => {
      console.log(message.data);
    }
  }

  return <div>
    <button onClick={() => {
      socket?.send("ping")
    }}>Click me</button>
  </div>
}