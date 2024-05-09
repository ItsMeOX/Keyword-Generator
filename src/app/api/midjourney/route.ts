import { NextResponse, NextRequest } from 'next/server';
import { Midjourney } from 'midjourney';

const client = new Midjourney({
  SalaiToken: process.env.MIDJOURNEY_TOKEN as string,
  ServerId: process.env.DISCORD_SERVER_ID,
  ChannelId: process.env.DISCORD_CHANNEL_ID,
  Debug: true,
  Ws: true,
});

function randomIntFromInterval(lower: number, upper: number) {
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
}

async function sleepRandomMS() {
  await new Promise((r) => setTimeout(r, randomIntFromInterval(300, 800)));
}

export async function POST(req: NextRequest, res: NextResponse) {
  console.log('a');
  await client.init();

  const prompt = 'testing';

  const Imagine = await client.Imagine(prompt);

  sleepRandomMS();

  const U1CustomID = Imagine?.options?.find((o) => o.label === 'U1')?.custom;

  if (U1CustomID) {
    const UpScale = await client.Custom({
      msgId: Imagine.id as string,
      flags: Imagine.flags,
      customId: U1CustomID,
    });
  } else {
    console.log('NO U1CustomID!!!');
  }

  client.Close();

  return NextResponse.json(
    { Imagine },
    {
      status: 200,
    }
  );
}
