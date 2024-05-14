import { NextResponse, NextRequest } from 'next/server';
import { MJMessage, Midjourney } from 'midjourney';

function randomIntFromInterval(lower: number, upper: number) {
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
}

async function sleepRandomMS() {
  await new Promise((r) => setTimeout(r, randomIntFromInterval(1800, 3500)));
}

async function retryFn(fn: () => Promise<MJMessage | null>, retries: number) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt < retries) {
        await sleepRandomMS();
        console.log('error, retrying... ', error);
      }
    }
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  const images: MJMessage[] = [];
  const indices = [1] as const;

  console.log('ran');

  const body = await req.json();
  const {
    prompt,
    initClient,
    closeClient,
  }: { prompt: string; initClient: boolean; closeClient: boolean } = body;

  const client = new Midjourney({
    SalaiToken: process.env.MIDJOURNEY_TOKEN as string,
    ServerId: process.env.DISCORD_SERVER_ID,
    ChannelId: process.env.DISCORD_CHANNEL_ID,
    MaxWait: 500000,
    //   Debug: true,
    Ws: true,
  });

  await client.init();
  const Imagine = await retryFn(async () => await client.Imagine(prompt), 10);

  if (!Imagine) {
    console.log('no Image.');
    return;
  }

  for (const i of indices) {
    await sleepRandomMS();
    const upScale = await retryFn(
      async () =>
        await client.Upscale({
          index: i,
          msgId: Imagine.id as string,
          hash: Imagine.hash as string,
          flags: Imagine.flags,
        }),
      10
    );

    if (!upScale) {
      console.log('no upScale.');
      return;
    }

    const zoomout = upScale?.options?.find((o) => o.label === 'Custom Zoom');

    if (!zoomout) {
      console.log('no zoomout.');
      return;
    }

    let prompt2 = prompt
      .replace('\r', '')
      .replace('\n', '')
      .replace('--v 6', '');
    console.log('prompt21', prompt2);
    prompt2 += ' --zoom 1 --v 5.2';
    console.log('prompt22', prompt2);

    await sleepRandomMS();
    const customZoom = await retryFn(
      async () =>
        await client.Custom({
          msgId: upScale.id as string,
          flags: upScale.flags,
          content: prompt2,
          customId: zoomout.custom,
          loading: (uri: string, progress: string) => {
            console.log('customZoom loading', uri, 'progress', progress);
          },
        }),
      10
    );
    console.log('customZoom done.');

    if (!customZoom) {
      console.log('no customZoom.');
      return;
    }

    console.log('customZoom', customZoom);
    await sleepRandomMS();
    const upScale2 = await retryFn(
      async () =>
        await client.Upscale({
          index: 1,
          msgId: customZoom.id as string,
          hash: customZoom.hash as string,
          flags: customZoom.flags,
          loading: (uri: string, progress: string) => {
            console.log('upScale2 loading', uri, 'progress', progress);
          },
        }),
      10
    );
    if (!upScale2) {
      console.log('no upScale2.');
      return;
    }

    console.log('upScale2', upScale2);

    const upScaleID = upScale2.options?.find(
      (o) => o.label === 'Upscale (2x)'
    )?.custom;
    if (!upScaleID) {
      console.log('no upScaleID.');
      return;
    }

    await sleepRandomMS();
    console.log('upScaleID', upScaleID);

    const upScale3 = await retryFn(
      async () =>
        await client.Custom({
          msgId: upScale2.id as string,
          flags: upScale2.flags,
          customId: upScaleID,
        }),
      10
    );

    if (upScale3) {
      images.push(upScale3);
    }
    console.log('upScale3', upScale3);

    // Need to close otherwise upScaling after custom zoom for the 2nd time won't work
    client.Close();
    await client.init();
  }

  return NextResponse.json(
    { images },
    {
      status: 200,
    }
  );
}
