import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { marked } from 'marked';
import { sanitizeMarkdown } from './sanitizeMarkdown';

interface GeneratePDFOptions {
  content: string;
  filename?: string;
  title?: string;
}

export async function generatePDF({ content, filename = 'ats-result.pdf', title = 'ATS Checker Result' }: GeneratePDFOptions) {
  const sanitizedContent = sanitizeMarkdown(content);

  let htmlContent = marked.parse(sanitizedContent) as string;

  htmlContent = htmlContent
    .replace(/<li>\s*<p>([\s\S]*?)<\/p>\s*<\/li>/g, '<li>$1</li>')
    .replace(/<\/p>\s*<p>/g, '<br><br>')
    .replace(/<li>\s*<p>/g, '<li>')
    .replace(/<\/p>\s*<\/li>/g, '</li>');

  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 700px;
    background: white;
    color: #171717;
    font-family: Arial, Helvetica, sans-serif;
  `;

  const headerHTML = `
    <div style="margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #3b82f6;">
      <h1 style="font-size: 24px; margin: 0; color: #1f2937; font-weight: bold;">${title}</h1>
      <p style="font-size: 11px; color: #6b7280; margin-top: 6px;">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  `;

  container.innerHTML = `
    <div style="padding: 40px;">
      ${headerHTML}
      <div class="pdf-markdown-content" style="font-size: 14px; line-height: 1.75;">
        <style>
          .pdf-markdown-content h1 { font-size: 24px; font-weight: 800; margin-top: 32px; margin-bottom: 16px; color: #111827; }
          .pdf-markdown-content h2 { font-size: 20px; font-weight: 700; margin-top: 28px; margin-bottom: 12px; color: #111827; }
          .pdf-markdown-content h3 { font-size: 16px; font-weight: 600; margin-top: 20px; margin-bottom: 8px; color: #111827; }
          .pdf-markdown-content h4 { font-size: 14px; font-weight: 600; margin-top: 16px; margin-bottom: 6px; color: #111827; }
          .pdf-markdown-content p { margin-bottom: 12px; color: #374151; }
          .pdf-markdown-content strong { font-weight: 600; }
          .pdf-markdown-content em { font-style: italic; }
          .pdf-markdown-content a { color: #2563eb; text-decoration: underline; }
          .pdf-markdown-content code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; color: #be185d; }
          .pdf-markdown-content pre { background: #1f2937; color: #e5e7eb; padding: 16px; border-radius: 6px; overflow-x: auto; font-size: 13px; line-height: 1.5; }
          .pdf-markdown-content pre code { background: transparent; color: inherit; padding: 0; }
          .pdf-markdown-content hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
          .pdf-markdown-content blockquote { border-left: 4px solid #e5e7eb; padding-left: 16px; margin: 16px 0; color: #6b7280; font-style: italic; }
          .pdf-markdown-content ul { margin-top: 12px; margin-bottom: 12px; padding-left: 28px; list-style-type: disc; }
          .pdf-markdown-content ol { margin-top: 12px; margin-bottom: 12px; padding-left: 28px; list-style-type: decimal; }
          .pdf-markdown-content li { margin-bottom: 6px; line-height: 1.6; display: list-item; }
          .pdf-markdown-content li p { display: inline; margin: 0; padding: 0; }
          .pdf-markdown-content li br { display: block; content: ''; margin: 0; }
          .pdf-markdown-content li ul, .pdf-markdown-content li ol { margin-top: 4px; margin-bottom: 4px; }
          .pdf-markdown-content table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 16px; font-size: 13px; }
          .pdf-markdown-content th { background: #f9fafb; border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; font-weight: 600; color: #111827; }
          .pdf-markdown-content td { border: 1px solid #e5e7eb; padding: 8px 12px; color: #374151; }
          .pdf-markdown-content tr:nth-child(even) { background: #f9fafb; }
        </style>
        ${htmlContent}
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 700,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [imgWidth, imgHeight],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}
