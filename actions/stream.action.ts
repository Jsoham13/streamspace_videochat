/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from '@stream-io/node-sdk';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error('User is not authenticated');
  if (!STREAM_API_KEY) throw new Error('Stream API key secret is missing');
  if (!STREAM_API_SECRET) throw new Error('Stream API secret is missing');

  const client = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

  const vailidity = 60 * 60;
  
  const token = client.generateUserToken({ user_id: user.id, validity_in_seconds: vailidity });

  return token;
}