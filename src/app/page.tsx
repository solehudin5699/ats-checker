'use client';
import { FormEvent, useState } from 'react';
import ResumeOrCv from '@/components/ResumeOrCv';
import Result from '@/components/Result';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<{ data: { data?: string }; loading: boolean }>({
    data: {},
    loading: false,
  });

  const handleAnalyze = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!formData.get('resumeText') && !formData.get('file')) {
      return alert('Please upload or paste your CV/resume');
    } else if (!formData.get('jobDescription')) {
      return alert('Please enter the job description');
    }

    let resumeText = formData.get('resumeText');
    try {
      setState({
        data: {},
        loading: true,
      });
      // parse file if exists
      if (!!formData.get('file')) {
        const parseResponse = await fetch('/api/parse-file', {
          method: 'POST',
          body: formData,
        });
        const parseData = await parseResponse.json();
        if (!parseData.resumeText) {
          throw new Error('Error parsing file');
        }
        resumeText = parseData.resumeText;
      }
      // start streaming analys
      await analyzeResume(resumeText as string, formData.get('jobDescription') as string);
    } catch (_error) {
      setState({
        data: {},
        loading: false,
      });
      alert('Error analyzing resume');
    }
  };

  async function analyzeResume(resumeText: string, jobDescription: string) {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, jobDescription }),
    });

    if (!response.body) {
      throw new Error('Tidak ada respons dari server.');
    }

    setIsOpen(true);

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let result = '';
    let isFirstChunk = true; // Menandakan apakah chunk pertama sudah diterima

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      result += chunk;

      setState({ ...state, data: { data: result } });
      if (isFirstChunk && result.includes('⏳ Memulai analisis...')) {
        // Hapus pesan loading dari result
        result = result.replace('⏳ Memulai analisis...\n\n', '');
        isFirstChunk = false; // Supaya hanya dijalankan sekali
      }
    }

    return result;
  }
  return (
    <>
      <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] container-app w-full fixed top-0 left-0 right-0 bottom-0 overflow-y-auto grid place-content-center">
        <ThemeToggle />
        <form
          className="p-5 bg-white/90 dark:bg-zinc-900/92 rounded-2xl w-full lg:w-[750px]"
          onSubmit={handleAnalyze}
        >
          <h2 className="text-lg font-bold mb-10 text-zinc-900 dark:text-zinc-100">ATS Checker</h2>
          <ResumeOrCv />
          <h6 className="font-semibold mt-5 text-zinc-800 dark:text-zinc-200">Job Description</h6>
          <textarea
            className="w-full p-2 mt-2 border border-blue-300 dark:border-blue-800 h-32 rounded-2xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            placeholder="Paste Job Description Here..."
            name="jobDescription"
          />
          <button
            className="mt-2 p-2 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white w-full rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={state.loading}
            type="submit"
          >
            {state.loading ? 'Analyzing...' : 'Analyze'}
          </button>
          {state?.data?.data && (
            <button
              type="button"
              className="cursor-pointer text-blue-600 dark:text-blue-400 mt-10 underline"
              onClick={() => setIsOpen(true)}
            >
              View Result
            </button>
          )}
        </form>
      </div>
      <Result isOpen={isOpen} setIsOpen={setIsOpen} result={state?.data?.data as string} />
    </>
  );
}
