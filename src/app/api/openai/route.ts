import OpenAI from 'openai';
import PdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const client = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const formData = await request.formData();

  const file = formData.get('file') as File | null;
  let resumeText = formData.get('resumeText');

  if (file) {
    const fileType = file.type || file.name.split('.').pop()?.toLowerCase();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (fileType === 'application/pdf' || fileType === 'pdf') {
      // Parsing PDF
      const pdfData = await PdfParse(buffer);
      resumeText = pdfData.text;
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'docx'
    ) {
      // Parsing DOCX
      const result = await mammoth.extractRawText({ buffer });
      resumeText = result.value;
    } else {
      return Response.json({ error: 'Unsupported file format' }, { status: 400 });
    }
  }

  const prompt = `
    Anda adalah sistem ATS yang menganalisis kecocokan resume dengan job description.
    Resume: ${resumeText}
    Job Description: ${formData.get('jobDescription')}
    
    Berikan skor kecocokan dari 0-100 (dalam persentase misal 90%) dan berikan saran perbaikan.
  `;

  // const prompt = `
  //   Anda adalah sistem ATS yang menganalisis kecocokan resume dengan job description.
  //   Resume: ${resumeText}
  //   Job Description: ${formData.get('jobDescription')}
  //   Tugas Anda:
  //   1. Berikan skor kecocokan dari 0-100 (dalam persentase misal 90%) berdasarkan kesesuaian kata kunci, pengalaman kerja, dan keterampilan.
  //   2. Tampilkan daftar keterampilan yang cocok dan tidak cocok.
  //   3. Berikan analisis kecocokan dan saran perbaikan untuk meningkatkan skor ATS.
  // `;
  try {
    const response = await client.chat.completions.create({
      // model: 'gpt-4-turbo',
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: prompt }],
    });

    return Response.json({
      status: 'success',
      data: response.choices?.[0]?.message?.content,
    });
  } catch (_error) {
    return Response.json({ error: 'Error analyzing resume', status: 'error' }, { status: 500 });
  }
}
