import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge'; // make Edge Function

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
    }

    const prompt = `
      Anda adalah sistem ATS yang menganalisis kecocokan resume dengan job description.
      Resume: ${resumeText}
      Job Description: ${jobDescription}
      
      Berikan skor kecocokan dari 0-100 (dalam persentase misal 90%) dan berikan saran perbaikan.
    `;

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode('⏳ Memulai analisis...\n\n'));

        try {
          const response = await client.chat.completions.create({
            model: 'deepseek-chat',
            messages: [{ role: 'system', content: prompt }],
            stream: true,
          });

          for await (const chunk of response) {
            const textChunk = chunk.choices?.[0]?.delta?.content;
            if (textChunk) {
              controller.enqueue(encoder.encode(textChunk));
            }
          }

          controller.close();
        } catch (_error) {
          controller.enqueue(encoder.encode('❌ Terjadi kesalahan saat memproses permintaan.'));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (_error) {
    return new Response(JSON.stringify({ error: 'Error processing request' }), { status: 500 });
  }
}
