import { NextResponse, NextRequest } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

type ResponseData = {
  text?: string;
  errorMessage?: string;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

function fileToGenerativePart(arrayBuffer: ArrayBuffer, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(arrayBuffer).toString('base64'),
      mimeType,
    },
  };
}

export async function POST(req: NextRequest, res: NextResponse<ResponseData>) {
  try {
    const prompt = 'Generate 30 keywords for the image, separated by commas';

    const formData = await req.formData();

    const imageParts = [];

    for (const [key, file] of formData.entries()) {
      if (file instanceof File) {
        let arrayBuffer = await file.arrayBuffer();
        imageParts.push(fileToGenerativePart(arrayBuffer, file.type));
        console.log(`File name: ${file.name}`);
        console.log(`File size: ${file.size}`);
      }
    }

    const text = 'hello :)';

    // const result = await model.generateContent([prompt, ...imageParts]);
    // const text = result.response.text();

    return NextResponse.json(
      { text },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    return NextResponse.json({ errorMessage: message }, { status: 500 });
  }
}
