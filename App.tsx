import React, { useState } from 'react';
import { Bot, Code2, PanelLeftClose, PanelLeftOpen, Github } from 'lucide-react';
import InputForm from './components/InputForm';
import ResultDashboard from './components/ResultDashboard';
import { analyzeResume } from './services/geminiService';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<{ mimeType: string; data: string } | null>(null);
  const [fileName, setFileName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeResume(resumeText, resumeFile, jobDescription);
      setResult(data);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f1115] text-gray-100 font-sans overflow-hidden">
      
      {/* Sidebar (Input) */}
      <div 
        className={`
          flex-shrink-0 bg-[#13151a] border-r border-[#2a2a2a] transition-all duration-300 ease-in-out relative
          ${isSidebarOpen ? 'w-full md:w-[450px]' : 'w-0'}
        `}
      >
        <div className={`h-full flex flex-col ${!isSidebarOpen && 'hidden'}`}>
            <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-white">ResumeAI</h1>
                        <p className="text-xs text-gray-500 font-mono">Studio Edition</p>
                    </div>
                </div>
            </div>
            
            <InputForm 
                resumeText={resumeText}
                setResumeText={setResumeText}
                resumeFile={resumeFile}
                setResumeFile={setResumeFile}
                fileName={fileName}
                setFileName={setFileName}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
            />

            <div className="p-4 border-t border-[#2a2a2a] text-xs text-gray-600 text-center">
                Powered by Gemini 2.5 Flash
            </div>
        </div>
      </div>

      {/* Main Content (Results) */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Toggle Sidebar Button (Floating or Header) */}
        <header className="h-16 border-b border-[#2a2a2a] bg-[#0f1115] flex items-center justify-between px-6 z-10">
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-[#2a2a2a] rounded-md text-gray-400 transition-colors"
                title={isSidebarOpen ? "Collapse Input" : "Expand Input"}
            >
                {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-4">
                 <span className="text-xs font-mono text-gray-500 bg-[#1a1c21] px-3 py-1 rounded-full border border-[#333]">v1.0.1</span>
            </div>
        </header>

        <main className="flex-1 overflow-hidden relative bg-[#0f1115]">
            {error && (
                <div className="absolute top-6 left-6 right-6 z-50">
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                         {error}
                    </div>
                </div>
            )}

            {!result && !isAnalyzing && (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500">
                    <div className="w-24 h-24 bg-[#1a1c21] rounded-full flex items-center justify-center mb-6 shadow-2xl border border-[#2a2a2a]">
                        <Code2 className="w-10 h-10 text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-300 mb-2">Ready to Analyze</h2>
                    <p className="max-w-md mx-auto mb-8 text-sm">
                        Upload your resume (PDF, DOCX) or paste text, then add the job description to generate a comprehensive AI-powered report.
                    </p>
                    <div className="flex gap-4 text-xs font-mono text-gray-600">
                        <span className="px-3 py-1 bg-[#1a1c21] rounded border border-[#2a2a2a]">ATS Check</span>
                        <span className="px-3 py-1 bg-[#1a1c21] rounded border border-[#2a2a2a]">Keyword Match</span>
                        <span className="px-3 py-1 bg-[#1a1c21] rounded border border-[#2a2a2a]">Skill Gap</span>
                    </div>
                </div>
            )}

            {isAnalyzing && !result && (
                <div className="h-full flex flex-col items-center justify-center p-8">
                    <div className="relative w-24 h-24 mb-8">
                        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-pulse"></div>
                        <div className="absolute inset-2 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Analyzing Resume...</h3>
                    <p className="text-sm text-gray-500 animate-pulse">Running multiple checks against JD...</p>
                </div>
            )}

            {result && (
                <ResultDashboard data={result} />
            )}
        </main>
      </div>
    </div>
  );
};

export default App;
