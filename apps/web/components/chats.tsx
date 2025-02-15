  "use client";

  import axios from "axios";
  import { useEffect, useRef, useState } from "react";
  import { BACKEND_URL, SOCKET_URL } from "@repo/common/config";
  import useSocket from "../hooks/useSocket";
  import { useRouter } from "next/navigation";

  interface Chat {
    id: number
    userId: number
    message: string
  };

  const ChatMessage: React.FC<{ roomId: string }> = ({
    roomId
  }) => {
    const [chats, setChats] = useState<Chat[]>([]);
    const postChatRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const { socket, loader } = useSocket({
      wsURL: `${SOCKET_URL}?token=${localStorage.getItem('token')}`
    });

    useEffect(() => {
      axios.get(`${BACKEND_URL}/chats/${roomId}`, {
        headers: {
          "authorization": localStorage.getItem("token")
        }
      })
      .then((res) => setChats(res.data.chatMessages))
      .catch(err => console.log(err));
    }, []);


    useEffect(() => {
      if(socket && !loader) {
        
        socket?.send(JSON.stringify({
          type: 'join-room', 
          roomId
        }));

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log(data);
          if(data.type = 'chat') {
            setChats((prevChats) => [...prevChats, {
              id: prevChats.length + 1,
              userId: data.userId,
              message: data.message,
            }]);
          }
        }
      }
    }, [socket, loader]);

    return <>
      {loader ? (
        <div>Loading ...</div>
      ): (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignContent: "center",
            padding: "20vh",
          }}
        >
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <div>
              {roomId}
            </div>
            <div>
              {chats.length > 0 && chats.map((chat) => {
                return <div
                  key={chat.id}
                >
                  {chat.userId} has messaged = {chat.message}
                </div>
              })}
            </div>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center"
          }}>
            <input 
              type="text"
              placeholder="Enter chat message" 
              ref={postChatRef}
            />
            <button
              onClick={async() => {
                if(!postChatRef || !postChatRef.current) return;
                const chatMessage = postChatRef.current.value;
                socket?.send(JSON.stringify({
                  type: 'chat',
                  roomId,
                  chatMessage
                }));
                setChats((prevChats) => [...prevChats, {
                  userId: Number(localStorage.getItem("userId")),
                  message: chatMessage,
                  id: prevChats.length + 1
                }]);
                postChatRef.current.value = ''
              }}
            >
              Post
            </button>
          </div>
          <button
            onClick={() => {
              socket?.send(JSON.stringify({
                type: "leave",
                roomId
              }))
              router.replace("/room");
            }}
          >
            Leave
          </button>
        </div>
      )}
    </>
  }

  export default ChatMessage;