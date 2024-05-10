import { NextResponse, NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useSettingContext } from '@/app/contexts/SettingContext';
import { headers } from 'next/headers';

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
  const headersList = headers();
  const keywordCount = headersList.get('keywordCount') || '30';

  try {
    const prompt = `Generate ${keywordCount} single-worded keywords, separated by commas`;
    console.log(keywordCount);

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

    // const text = 'hello :)';

    const result = await model.generateContent([prompt, ...imageParts]);
    const text = result.response.text().trim() + '\n';
    console.log(text);

    return NextResponse.json(
      { text },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    return NextResponse.json({ errorMessage: message }, { status: 500 });
  }
}
