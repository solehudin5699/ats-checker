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

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: prompt }],
    });

    return new Response(
      JSON.stringify({
        status: 'success',
        data: response.choices?.[0]?.message?.content,
      }),
      { status: 200 }
    );
  } catch (_error) {
    return new Response(JSON.stringify({ error: 'Error processing request' }), { status: 500 });
  }
}
