import React, { useRef, useEffect } from "react";

function VideoPlayer() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.loop = true;
      videoRef.current.autoplay = true;
      videoRef.current.playbackRate = 2;
    }
  }, []);

  return (
    <div>
      <video ref={videoRef} className="w-full my-4 rounded">
        <source src="/STARS_Token.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoPlayer;
