"use client";

import React, { useEffect, useState } from "react";
import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export function MediaRoom({ chatId, video, audio }: MediaRoomProps) {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;
    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        console.log('Fetching token for room:', chatId);
        const response = await fetch(
          `/api/livekit?room=${encodeURIComponent(chatId)}&username=${encodeURIComponent(name)}`
        );
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Token fetch failed:', data);
          return;
        }

        // Verify token is a string
        if (typeof data.token !== 'string') {
          console.error('Invalid token format:', data.token);
          return;
        }

        console.log('Token received, length:', data.token.length);
        setToken(data.token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  // Don't render LiveKitRoom until we have a valid token
  if (!token) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading...
        </p>
      </div>
    );
  }

  // Make sure NEXT_PUBLIC_LIVEKIT_URL is properly formatted
  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  if (!serverUrl?.startsWith('wss://')) {
    console.error('Invalid LiveKit URL:', serverUrl);
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <p className="text-xs text-red-500">Configuration error</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      serverUrl={serverUrl}
      connect={true}
      data-lk-theme="default"
      onError={(error) => {
        console.error('LiveKit connection error:', error);
      }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}