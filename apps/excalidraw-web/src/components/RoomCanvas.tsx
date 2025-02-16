"use client";

import useSocket from "@/hooks/useSocket";
import { SOCKET_URL } from "@repo/common/config";
import { useEffect } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({
  roomId
}: {
  roomId: string
}) {
  const token = localStorage.getItem("token");
    if(!token) return <div>
      Token Not found...
    </div>
  
    const { socket, loader } = useSocket(`${SOCKET_URL}?token=${token}`);
    
    useEffect(() => {
      if(socket && !loader) {
        socket?.send(JSON.stringify({
          type: "join-room",
          roomId
        }));
      }
    }, [socket, loader]);


    return <>
      {!socket ? (
        <div>Loading canvas background...</div>
      ): (
        <Canvas
          roomId={roomId}
          socket={socket}
        />
      )}
    </>

}