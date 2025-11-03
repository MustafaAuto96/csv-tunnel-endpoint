import { useState, useCallback, useMemo } from 'react';
import { CsvRow } from './types';
import FileUpload from './components/FileUpload';
import ResultCard from './components/ResultCard';
import { Header } from './components/Header';
import { Placeholder } from './components/Placeholder';

const App: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileContent, setFileContent] = useState<string>('');

  const handleFileSelect = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setFileContent(text);
      // Reset previous results on new file selection
      setCsvData([]);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
      setFileName(null);
      setFileContent('');
    };
    reader.readAsText(file);
  };

  const processCsv = useCallback(() => {
    if (!fileContent) {
      setError('No file content to process.');
      return;
    }
    setIsProcessing(true);
    setError(null);
    setCsvData([]);

    setTimeout(() => { // Simulate processing time
      try {
        const lines = fileContent.trim().split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) {
          throw new Error('CSV file must have a header and at least one data row.');
        }

        const headerLine = lines[0];
        
        // Auto-detect delimiter and create a parsing function
        let getValues: (line: string) => string[];
        if (headerLine.includes('\t')) {
          getValues = (line: string) => line.split(/\t+/).map(v => v.trim());
        } else if (headerLine.includes(',')) {
          getValues = (line: string) => line.split(',').map(v => v.trim());
        } else if (/\s{2,}/.test(headerLine)) {
          getValues = (line: string) => line.split(/\s{2,}/).map(v => v.trim());
        } else {
          throw new Error("Could not determine column delimiter. Please use tabs, commas, or at least two spaces between columns.");
        }

        const headers = getValues(headerLine);
        const lowerCaseHeaders = headers.map(h => h.toLowerCase());

        const tunnelEndpointIndex = lowerCaseHeaders.findIndex(h => h.includes('tunnel'));
        const stateIndex = lowerCaseHeaders.findIndex(h => h === 'state');

        if (tunnelEndpointIndex === -1) {
            throw new Error('CSV header missing a "Tunnel" column. Found headers: ' + headers.join(', '));
        }

        if (stateIndex === -1) {
          throw new Error('CSV header missing a "State" column. Found headers: ' + headers.join(', '));
        }

        const data = lines.slice(1).map((line, i) => {
          const values = getValues(line);
          
          const tunnelEndpoint = values[tunnelEndpointIndex];
          const state = values[stateIndex];

          if (!tunnelEndpoint || !state) {
            console.warn(`Skipping row with missing data ${i + 2}: ${line}`);
            return null;
          }

          return {
            tunnelEndpoint,
            state,
          };
        }).filter((row): row is CsvRow => row !== null);

        if (data.length === 0) {
            setError("Processing finished, but no valid data rows were found. Check file format.");
        }
        setCsvData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred during parsing.');
        }
      } finally {
        setIsProcessing(false);
      }
    }, 500);
  }, [fileContent]);

  const exclusionList = useMemo(() => ['DR-R1', 'DR-R2', 'DC-R1', 'DC-R2'], []);

  const filterData = useCallback((keyword: string) => {
    const lowerCaseKeyword = keyword.toLowerCase();

    return csvData.filter(row => {
      if (!row.tunnelEndpoint || !row.state) {
        return false;
      }

      const lowerCaseTunnel = row.tunnelEndpoint.toLowerCase();

      // Condition 1: Exclude tunnels starting with DR/DC prefixes
      const isExcluded = exclusionList.some(prefix =>
        lowerCaseTunnel.startsWith(prefix.toLowerCase())
      );
      if (isExcluded) {
        return false;
      }

      // Condition 2: Use a robust regex to find the keyword as a distinct segment
      // (e.g., ":private1-" or ending with ":private1") and must be in a 'down' state.
      const keywordRegex = new RegExp(`:${lowerCaseKeyword}(-|$)`);
      const hasKeyword = keywordRegex.test(lowerCaseTunnel);
      const isStateDown = row.state.trim().toLowerCase() === 'down';

      return hasKeyword && isStateDown;
    });
  }, [csvData, exclusionList]);

  const private1Data = useMemo(() => filterData('Private1'), [filterData]);
  const private2Data = useMemo(() => filterData('Private2'), [filterData]);
  const private3Data = useMemo(() => filterData('Private3'), [filterData]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <div className="bg-slate-800/50 rounded-lg p-6 shadow-lg border border-slate-700 mb-8 sticky top-4 z-10 backdrop-blur-md">
          <FileUpload
            onFileSelect={handleFileSelect}
            onProcess={processCsv}
            fileName={fileName}
            isProcessing={isProcessing}
            disabled={!fileContent}
          />
          {error && <p className="text-red-400 mt-4 text-center text-sm">{error}</p>}
        </div>
        
        {csvData.length === 0 && !isProcessing && <Placeholder />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ResultCard title="Private1 Endpoints" data={private1Data} isLoading={isProcessing} />
          <ResultCard title="Private2 Endpoints" data={private2Data} isLoading={isProcessing} />
          <ResultCard title="Private3 Endpoints" data={private3Data} isLoading={isProcessing} />
        </div>
      </div>
    </div>
  );
};

export default App;
