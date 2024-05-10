import { NextResponse, NextRequest } from 'next/server';
import { MJMessage, Midjourney } from 'midjourney';

function randomIntFromInterval(lower: number, upper: number) {
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
}

async function sleepRandomMS() {
  await new Promise((r) => setTimeout(r, randomIntFromInterval(1800, 3500)));
}

export async function POST(req: NextRequest, res: NextResponse) {
  const client = new Midjourney({
    SalaiToken: process.env.MIDJOURNEY_TOKEN as string,
    ServerId: process.env.DISCORD_SERVER_ID,
    ChannelId: process.env.DISCORD_CHANNEL_ID,
    //   Debug: true,
    Ws: true,
  });

  const body = await req.json();
  const {
    prompt,
    initClient,
    closeClient,
  }: { prompt: string; initClient: boolean; closeClient: boolean } = body;

  console.log(prompt);
  console.log(initClient);
  console.log(closeClient);

  if (initClient) await client.init();

  await sleepRandomMS();

  const Imagine = await client.Imagine(prompt);
  console.log('imagine: ');
  console.log(Imagine);
  if (Imagine === null) {
    return NextResponse.json(
      { errorMessage: 'No imagine generated.' },
      {
        status: 500,
      }
    );
  }

  await sleepRandomMS();

  //   const U1CustomID = Imagine?.options?.find((o) => o.label === 'U1')?.custom;
  //   if (U1CustomID === undefined) {
  //     console.log('No U1');
  //     return NextResponse.json(
  //       { errorMessage: 'No U1CustomID' },
  //       {
  //         status: 500,
  //       }
  //     );
  //   }

  const upScales: MJMessage[] = [];

  const indices = [1, 2, 3, 4] as const;

  for (const i of indices) {
    const upScale = await client.Upscale({
      index: i,
      msgId: Imagine.id as string,
      hash: Imagine.hash as string,
      flags: Imagine.flags,
    });

    if (upScale) upScales.push(upScale);
    console.log('upScale');
    console.log(upScale);
  }

  console.log('upScales');
  console.log(upScales);

  if (closeClient) client.Close();

  console.log('EOF');

  return NextResponse.json(
    { upScales },
    {
      status: 200,
    }
  );
}
