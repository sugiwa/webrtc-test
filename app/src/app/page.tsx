"use client";
import { useEffect, useRef, useState } from "react";
import useWebsocket from "./hooks/useWebsocket";

export default function Home() {
  const [stream, setStream] = useState<MediaStream>();
  const [pc, setPc] = useState<RTCPeerConnection>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const { socket, sendMessage } = useWebsocket();

  useEffect(() => {
    const setupMediaStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
      setStream(stream);
    };
    setupMediaStream();
  }, []);

  if (!socket) return <div>loading...</div>;

  const handleClick = () => {
    console.log("CLINET", socket.id);
    sendMessage("test");
  };

  socket.on("message", (data) => {
    console.log("Message: " + data);
  });

  const handleStart = async () => {
    socket.emit("start", "sdfadfsd");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div>
          <video ref={videoRef} autoPlay playsInline></video>
        </div>

        <p>your ID: {socket.id}</p>
        <div className="flex">
          <button
            className="m-2 p-2 border-gray-200 border-2 rounded-md"
            onClick={handleClick}
          >
            Message
          </button>
          <button
            className="m-2 p-2 border-gray-200 border-2 rounded-md"
            onClick={handleStart}
          >
            Start
          </button>
        </div>
      </div>
    </main>
  );
}
