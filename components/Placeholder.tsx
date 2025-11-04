import React from 'react';

export const Placeholder: React.FC = () => (
    <div className="text-center py-16 px-6 bg-slate-800/30 border border-dashed border-slate-700 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-xl font-semibold text-slate-300">No Data Processed</h3>
        <p className="mt-1 text-sm text-slate-500">Upload a CSV file and click "Process Data" to see your results.</p>
    </div>
);
