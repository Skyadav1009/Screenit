import React, { useRef, useState } from 'react';
import { Upload, FileText, Briefcase, FileUp, X, FileType } from 'lucide-react';
import mammoth from 'mammoth';

interface InputFormProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  resumeFile: { mimeType: string; data: string } | null;
  setResumeFile: (file: { mimeType: string; data: string } | null) => void;
  fileName: string;
  setFileName: (name: string) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const InputForm: React.FC<InputFormProps> = ({
  resumeText,
  setResumeText,
  resumeFile,
  setResumeFile,
  fileName,
  setFileName,
  jobDescription,
  setJobDescription,
  onAnalyze,
  isAnalyzing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const handleFile = async (file: File) => {
    setIsProcessingFile(true);
    setFileName(file.name);
    
    try {
      if (file.type === 'application/pdf') {
        // Handle PDF: Convert to Base64 for Gemini multimodal input
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
          const base64Data = base64String.split(',')[1];
          setResumeFile({ mimeType: 'application/pdf', data: base64Data });
          setResumeText(''); // Clear text input when using file
          setIsProcessingFile(false);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Handle DOCX: Extract text using mammoth
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          try {
            const result = await mammoth.extractRawText({ arrayBuffer });
            setResumeText(result.value);
            setResumeFile(null);
            setIsProcessingFile(false);
          } catch (err) {
            console.error("Error reading docx", err);
            setFileName('');
            alert("Failed to read DOCX file.");
            setIsProcessingFile(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === 'text/plain') {
        // Handle TXT
        const reader = new FileReader();
        reader.onload = (e) => {
           setResumeText(e.target?.result as string);
           setResumeFile(null);
           setIsProcessingFile(false);
        };
        reader.readAsText(file);
      } else {
        alert("Unsupported file type. Please use PDF, DOCX, or TXT.");
        setFileName('');
        setIsProcessingFile(false);
      }
    } catch (error) {
      console.error(error);
      setIsProcessingFile(false);
      setFileName('');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearFile = () => {
    setResumeFile(null);
    setResumeText('');
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const hasContent = resumeText.length > 50 || resumeFile !== null;

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-medium text-blue-200 uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          Resume
        </label>
        
        {/* File Upload Area */}
        {!fileName ? (
           <div className="flex flex-col gap-4">
             <div 
               onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
               onDragLeave={() => setIsDragOver(false)}
               onDrop={onDrop}
               onClick={() => fileInputRef.current?.click()}
               className={`
                 relative w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group
                 ${isDragOver 
                   ? 'border-blue-500 bg-blue-500/10' 
                   : 'border-[#333] bg-[#1e1e1e] hover:border-gray-500 hover:bg-[#252525]'}
               `}
             >
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept=".pdf,.docx,.txt"
                 onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
               />
               <div className="p-4 bg-[#2a2a2a] rounded-full mb-3 group-hover:scale-110 transition-transform">
                 <FileUp className={`w-6 h-6 ${isDragOver ? 'text-blue-400' : 'text-gray-400'}`} />
               </div>
               <p className="text-sm text-gray-300 font-medium">Click to upload or drag & drop</p>
               <p className="text-xs text-gray-500 mt-1">PDF, DOCX, or TXT (Max 5MB)</p>
             </div>
             
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#333]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#13151a] px-2 text-gray-500">Or paste text</span>
                </div>
             </div>

             <textarea
               value={resumeText}
               onChange={(e) => setResumeText(e.target.value)}
               placeholder="Paste resume text manually..."
               className="w-full h-32 p-4 bg-[#1e1e1e] border border-[#333] rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-300 font-mono text-sm resize-none transition-all placeholder-gray-600 shadow-inner"
             />
           </div>
        ) : (
          <div className="w-full p-4 bg-blue-900/10 border border-blue-500/30 rounded-xl flex items-center justify-between group">
             <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <FileType className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-blue-200 truncate max-w-[200px]">{fileName}</span>
                  <span className="text-xs text-blue-400/60">
                    {isProcessingFile ? 'Processing...' : resumeFile ? 'PDF Ready' : 'Text Extracted'}
                  </span>
                </div>
             </div>
             <button 
               onClick={clearFile}
               className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
             >
               <X className="w-4 h-4" />
             </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-medium text-purple-200 uppercase tracking-wider">
          <Briefcase className="w-4 h-4" />
          Job Description
        </label>
        <div className="relative group flex-1">
            <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-48 p-4 bg-[#1e1e1e] border border-[#333] rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-gray-300 font-mono text-sm resize-none transition-all placeholder-gray-600 shadow-inner"
            />
             <div className="absolute bottom-3 right-3 text-xs text-gray-500 pointer-events-none">
                {jobDescription.length} chars
            </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || isProcessingFile || !hasContent || !jobDescription}
          className={`w-full py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all shadow-lg
            ${
              isAnalyzing || isProcessingFile || !hasContent || !jobDescription
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-blue-500/25'
            }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Run Analysis</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;
