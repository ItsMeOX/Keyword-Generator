import { NextResponse, NextRequest } from 'next/server';
import { MJMessage, Midjourney } from 'midjourney';

const client = new Midjourney({
  SalaiToken: process.env.MIDJOURNEY_TOKEN as string,
  ServerId: process.env.DISCORD_SERVER_ID,
  ChannelId: process.env.DISCORD_CHANNEL_ID,
  //   Debug: true,
  Ws: true,
});

function randomIntFromInterval(lower: number, upper: number) {
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
}

async function sleepRandomMS() {
  await new Promise((r) => setTimeout(r, randomIntFromInterval(800, 1500)));
}

export async function POST(req: NextRequest, res: NextResponse) {
  await client.init();
  const upScales: MJMessage[] = [];

  const body = await req.json();
  const { prompts }: { prompts: string[] } = body;

  for (let prompt of prompts) {
    await sleepRandomMS();

    const Imagine = await client.Imagine(prompt);

    await sleepRandomMS();

    const U1CustomID = Imagine?.options?.find((o) => o.label === 'U1')?.custom;

    if (U1CustomID) {
      const UpScale = await client.Custom({
        msgId: Imagine.id as string,
        flags: Imagine.flags,
        customId: U1CustomID,
      });
      if (UpScale) upScales.push(UpScale);
      else console.log('Upscale error.');
    } else {
      console.log('No U1CustomID.');
    }
  }

  client.Close();

  return NextResponse.json(
    { upScales },
    {
      status: 200,
    }
  );
}
