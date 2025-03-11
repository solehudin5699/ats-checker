import PdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const runtime = 'nodejs'; // Penting agar ini tetap di Node.js

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileType = file.type || file.name.split('.').pop()?.toLowerCase();

  let resumeText = '';

  try {
    if (fileType === 'application/pdf' || fileType === 'pdf') {
      const pdfData = await PdfParse(buffer);
      resumeText = pdfData.text;
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'docx'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      resumeText = result.value;
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported file format' }), { status: 400 });
    }

    return new Response(JSON.stringify({ resumeText }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error processing file' }), { status: 500 });
  }
}
