import React from 'react';
import { CsvRow } from '../types';

interface ResultCardProps {
  title: string;
  data: CsvRow[];
  isLoading: boolean;
}

const StateBadge: React.FC<{ state: string }> = ({ state }) => {
  const lowerCaseState = state.toLowerCase();
  let bgColor = 'bg-slate-500';
  let textColor = 'text-slate-100';

  if (lowerCaseState.includes('up')) {
    bgColor = 'bg-green-500/20';
    textColor = 'text-green-400';
  } else if (lowerCaseState.includes('down')) {
    bgColor = 'bg-red-500/20';
    textColor = 'text-red-400';
  } else if (lowerCaseState.includes('issue') || lowerCaseState.includes('warn')) {
    bgColor = 'bg-amber-500/20';
    textColor = 'text-amber-400';
  }

  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
      {state}
    </span>
  );
};


const SkeletonLoader: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-700 rounded w-1/6"></div>
            </div>
        ))}
    </div>
);


const ResultCard: React.FC<ResultCardProps> = ({ title, data, isLoading }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-xl p-4 flex flex-col h-full min-h-[300px]">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-700">
        <h3 className="text-lg font-bold text-sky-400">{title}</h3>
        <span className="text-sm font-mono bg-slate-700/50 text-slate-300 rounded-md px-2.5 py-1">{isLoading ? '...' : data.length}</span>
      </div>
      <div className="overflow-y-auto flex-grow custom-scrollbar">
        {isLoading ? (
            <SkeletonLoader />
        ) : data.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 bg-slate-800/50 backdrop-blur-sm">
              <tr>
                <th className="py-2 pr-2 font-semibold text-slate-400">Tunnel Endpoint</th>
                <th className="py-2 pl-2 font-semibold text-slate-400 text-right">State</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-t border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-2.5 pr-2 font-mono text-slate-300">{row.tunnelEndpoint}</td>
                  <td className="py-2.5 pl-2 text-right">
                    <StateBadge state={row.state} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>No matching data found.</p>
          </div>
        )}
      </div>
       <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(100, 116, 139, 0.5);
            border-radius: 10px;
            border: 2px solid transparent;
            background-clip: content-box;
          }
           .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(100, 116, 139, 0.8);
          }
        `}</style>
    </div>
  );
};

export default ResultCard;
