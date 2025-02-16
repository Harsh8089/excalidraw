import { SOCKET_URL } from "@repo/common/config";
import { useState, useEffect } from "react";

export default function useSocket(wsURL: string) {
  const [socket, setSocket] = useState<WebSocket>();
  const [loader, setLoader] = useState<boolean>(true);

  useEffect(() => {
    const ws = new WebSocket(wsURL);
    ws.onopen = () => {
      setSocket(ws);
      setLoader(false);
    }

    ws.onerror = (err) => {
      console.log(err);
    }

    return () => ws.close();
  }, []);

  return {
    socket,
    loader
  };
};