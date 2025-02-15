import { useEffect, useState } from "react"

const useSocket = ({
  wsURL
}: {
  wsURL: string
}) => {
  const [loader, setLoader] = useState<boolean>(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(wsURL);
    ws.onopen = () => {
      setSocket(ws);
      setLoader(false);
    };

    ws.onerror = (err) => {
      console.log(err);
    }

    return () => ws.close();
  }, []);

  return {
    socket,
    loader
  }
};

export default useSocket;

