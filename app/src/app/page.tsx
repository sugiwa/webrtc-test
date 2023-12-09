"use client";
import { useState } from "react";
import useWebsocket from "./hooks/useWebsocket";
import Video from "@/component/Video";

export default function Home() {
  const [stream, setStream] = useState<MediaStream>();
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();

  const { socket, sendMessage } = useWebsocket();

  if (!socket) return <div>loading...</div>;

  const handleClick = () => {
    console.log("CLINET", socket.id);
    sendMessage("test");
  };

  socket.on("message", (data) => {
    console.log("Message: " + data);
  });

  const handleSetup = async () => {
    console.log("set up webrtc");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(stream);
  };

  const handleStart = async () => {
    const peerConnection = createPeerConnection();
    stream
      ?.getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

    // offer
    const offer = await peerConnection.createOffer();
    console.log("offer", offer);
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", offer);
    setPeerConnection(peerConnection);
  };

  socket.on("offer", async (offer) => {
    console.log("row offer", offer);
    let pc = peerConnection;
    if (!pc) {
      console.log("set RTCPeerConnection");
      const newPeerConnection = createPeerConnection();
      stream
        ?.getTracks()
        .forEach((track) => newPeerConnection.addTrack(track, stream));
      await newPeerConnection.setRemoteDescription(offer);
      setPeerConnection(newPeerConnection);
      pc = newPeerConnection;
    }
    console.log("AnswerPC,", pc);
    // answer
    const answer = await pc.createAnswer();
    console.log("answer", answer);
    await pc.setLocalDescription(answer);

    socket.emit("answer", answer);
  });

  socket.on("answer", async (answer) => {
    console.log(`receive answer`, answer);
    if (peerConnection) {
      console.log("answer stage peerCOnnection", peerConnection);
      const signalingState = peerConnection.signalingState;
      console.log(`signaling state is ${signalingState}`);
      if (signalingState === "stable") return;
      await peerConnection.setRemoteDescription(answer);
    }
  });

  socket.on("ice-candidate", async (candidate) => {
    if (peerConnection) {
      console.log(`client[${socket.id}] get ICECandidate: ${candidate}`);
      peerConnection.addIceCandidate(candidate);
    }
  });

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection();

    peerConnection.ontrack = (event) => {
      console.log("ontrack", event);
      setRemoteStreams([...remoteStreams, event.streams[0]]);
    };

    peerConnection.onicecandidate = (e) => {
      console.log("oncandidate", e.cancelable, e.candidate);
      socket.emit("ice-candidate", e.candidate);
    };
    peerConnection.oniceconnectionstatechange = (e) => {
      console.log("ice connection change state", e.cancelable);
    };
    peerConnection.onicecandidateerror = (e) => {
      console.log("ice candidate error", e);
    };
    peerConnection.onnegotiationneeded = (e) => {
      console.log("negotiated needed", e);
    };

    return peerConnection;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div>{stream && <Video stream={stream} />}</div>

        <div>
          <p>remote stream count: {remoteStreams.length}</p>
          {remoteStreams.map((rs, i) => (
            <Video key={i} stream={rs} />
          ))}
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

        <div className="flex">
          <button
            className="m-2 p-2 border-gray-200 border-2 rounded-md"
            onClick={handleSetup}
          >
            Setup
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
