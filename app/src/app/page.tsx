"use client";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("ws://localhost:8001/chat");

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    socket.emit("message", "test!");
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div>
          <video ref={videoRef} autoPlay playsInline></video>
        </div>
        <button className="m-2 p-2 border-gray-200 border-2 rounded-md" onClick={handleClick}>Message</button>
      </div>
    </main>
  );
}
