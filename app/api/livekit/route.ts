export const dynamic = 'force-dynamic';

import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const room = req.nextUrl.searchParams.get("room");
    const username = req.nextUrl.searchParams.get("username");

    if (!room) {
      return NextResponse.json(
        { error: 'Missing "room" query parameter' },
        { status: 400 }
      );
    }
    if (!username) {
      return NextResponse.json(
        { error: 'Missing "username" query parameter' },
        { status: 400 }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      console.error('Missing LiveKit configuration:', {
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
        hasWsUrl: !!wsUrl
      });
      return NextResponse.json(
        { error: "LiveKit configuration missing" },
        { status: 500 }
      );
    }

    const at = new AccessToken(apiKey, apiSecret, { identity: username });

    at.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true
    });

    // In your api/livekit/route.ts
const token = await at.toJwt();
console.log('Generated token format:', {
  length: token.length,
  start: token.substring(0, 20),
  end: token.substring(token.length - 20)
});

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}