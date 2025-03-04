"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

type VideoProps = {
  src: string
  className?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  placeholder?: string
  videoDescription?: string
}

export default function Video({
  src,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  placeholder = "/logo-slogan.png",
  videoDescription = "The above video shows a tractor plowing a field. If you can't see the video.",
}: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let timeoutId: NodeJS.Timeout | null = null

    const captureThumbnail = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) return

      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = canvas.toDataURL("image/jpeg")
      setThumbnail(imageData)
      setIsLoaded(true)
      if (timeoutId) clearTimeout(timeoutId)
    }

    const handleLoadedData = () => {
      captureThumbnail()
    }

    const handleError = () => {
      console.error("Video failed to load")
      setShowFallback(true)
      if (timeoutId) clearTimeout(timeoutId)
    }

    // Show fallback if video doesn't load within 3 seconds
    timeoutId = setTimeout(() => {
      setShowFallback(true)
    }, 3000)

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("error", handleError)
    video.preload = "auto"
    video.load() // Explicitly trigger loading

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("error", handleError)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="relative h-full w-full">
      {!isLoaded && (showFallback || thumbnail) && (
        <Image
          src={thumbnail ?? placeholder}
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
        playsInline
        preload="auto"
      >
        <track label="thumbnails" default kind="metadata" />
        <track kind="metadata" label="cuepoints" />
        <track kind="chapters" label="chapters" />
      </video>
      <p className="sr-only">{videoDescription}</p>
    </div>
  )
}
