import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const endpoint = "http://localhost:8001/chat";

const useWebsocket = () => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io(endpoint, { transports: ["websocket"] });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = (text: string) => {
    socket?.emit("send", text);
  };

  return { socket, sendMessage };
};

export default useWebsocket;
