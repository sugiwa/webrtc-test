"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("ws://localhost:8001/chat");

export default function Home() {
  const [uuid, setUuid] = useState<String>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const setupMediaStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
    };
    setupMediaStream();

    setUuid(crypto.randomUUID());
  }, []);

  if (!socket) return <div>loading...</div>;

  const handleClick = () => {
    console.log('CLINET', socket.id)
    socket.emit("send", "test!");
  };

  socket.on("message", (data) => {
    console.log("Message: " + data);
  });

  const handleConnectWs = () => {
    socket.emit("connect");
  };

  const handleConnect = async () => {
    const conn = new RTCPeerConnection();
    // conn.addTrack();
    const offer = await conn.createOffer();
    console.log("offer", offer);
  };

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
            onClick={handleConnect}
          >
            Connect
          </button>
          <button
            className="m-2 p-2 border-gray-200 border-2 rounded-md"
            onClick={handleConnectWs}
          >
            ConnectWs
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
