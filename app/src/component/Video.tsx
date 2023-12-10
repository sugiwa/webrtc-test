import { useEffect, useRef } from "react";

type Props = {
  stream: MediaStream;
};

const Video = ({ stream }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const setupMediaStream = () => {
      videoRef.current.srcObject = stream;
    };
    setupMediaStream();
  }, [stream]);

  return <video ref={videoRef} controls autoPlay playsInline></video>;
};

export default Video;
