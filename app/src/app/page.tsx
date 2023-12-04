"use client";
import { io } from "socket.io-client";

const socket = io("ws://localhost:8001/chat");
export default function Home() {
  const handleClick = () => {
    socket.emit("message", "test!");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <button onClick={handleClick}>Message</button>
      </div>
    </main>
  );
}
