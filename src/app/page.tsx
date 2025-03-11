'use client';
import { FormEvent, useState } from 'react';
import ResumeOrCv from '@/components/ResumeOrCv';
import Result from '@/components/Result';

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

      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription: formData.get('jobDescription'),
        }),
      });
      const data = await response.json();
      setState({
        data,
        loading: false,
      });
      setIsOpen(true);
    } catch (_error) {
      setState({
        data: {},
        loading: false,
      });
      alert('Error analyzing resume');
    }
  };
  return (
    <>
      <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] container-app w-full fixed top-0 left-0 right-0 bottom-0 overflow-y-auto grid place-content-center">
        <form className="p-5 bg-white/90 rounded-2xl w-full lg:w-[750px]" onSubmit={handleAnalyze}>
          <h2 className="text-lg font-bold mb-10">ATS Checker</h2>
          <ResumeOrCv />
          <h6 className="font-semibold mt-5">Job Description</h6>
          <textarea
            className="w-full p-2 mt-2  border border-blue-300 h-32 rounded-2xl bg-white"
            placeholder="Paste Job Description Here..."
            name="jobDescription"
          />
          <button
            className="mt-2 p-2 bg-blue-500 text-white w-full rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={state.loading}
            type="submit"
          >
            {state.loading ? 'Analyzing...' : 'Analyze'}
          </button>
          {state?.data?.data && (
            <button
              type="button"
              className="cursor-pointer text-blue-600 mt-10 underline"
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
