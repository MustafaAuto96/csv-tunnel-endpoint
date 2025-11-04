import React, { useRef } from 'react';
import { UploadIcon, ProcessIcon } from './icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onProcess: () => void;
  fileName: string | null;
  isProcessing: boolean;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onProcess, fileName, isProcessing, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".csv, text/csv"
      />
      <button
        onClick={handleUploadClick}
        className="w-full sm:w-auto flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        <UploadIcon />
        {fileName ? 'Select another file' : 'Select CSV File'}
      </button>
      
      {fileName && (
        <div className="flex-grow flex items-center justify-center text-center sm:text-left text-sm text-slate-400 bg-slate-800 px-4 py-2 rounded-md border border-slate-700 w-full sm:w-auto">
          Selected: <span className="font-medium text-slate-300 ml-1.5">{fileName}</span>
        </div>
      )}
      
      <button
        onClick={onProcess}
        disabled={disabled || isProcessing}
        className="w-full sm:w-auto flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-md hover:bg-sky-500 transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <ProcessIcon />
            Process Data
          </>
        )}
      </button>
    </div>
  );
};

export default FileUpload;
