import { useEffect, useRef } from "react";

type Props = {
  stream: MediaStream;
};

const Video = ({ stream }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const setupMediaStream = () => {
      videoRef.current.srcObject = stream;
      videoRef.current?.play()  
    };
    setupMediaStream();
  }, [stream]);

  return <video ref={videoRef} autoPlay playsInline></video>;
};

export default Video;
