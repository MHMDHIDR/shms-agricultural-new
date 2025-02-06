"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type VideoProps = {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  placeholder?: string; // Add a static placeholder prop
};

export default function Video({
  src,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  placeholder = "/default-placeholder.jpg", // Default static placeholder
}: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let timeoutId: NodeJS.Timeout;

    const captureThumbnail = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");
      setThumbnail(imageData);
      setIsLoaded(true);
      clearTimeout(timeoutId);
    };

    const handleLoadedData = () => {
      captureThumbnail();
    };

    const handleError = () => {
      console.error("Video failed to load");
      setShowFallback(true);
      clearTimeout(timeoutId);
    };

    // Show fallback if video doesn't load within 2 seconds
    timeoutId = setTimeout(() => {
      setShowFallback(true);
    }, 2000);

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);
    video.preload = "auto";
    video.load(); // Explicitly trigger loading

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      {!isLoaded && (showFallback || thumbnail) && (
        <Image
          src={thumbnail || placeholder}
          alt="Video placeholder"
          fill
          className="absolute inset-0 h-full w-full object-cover blur-md filter"
          priority
        />
      )}
      <video
        ref={videoRef}
        src={src}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline // Improves mobile behavior
        preload="auto"
      />
    </div>
  );
}
