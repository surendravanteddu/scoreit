import { useState } from 'react';
import type { IBallHistory } from '~/types';

export const ScoreHistory = ({ ballHistory }: { ballHistory: Array<IBallHistory> }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      {/* Compact score display */}
      <div className="mt-4 bg-white rounded-lg shadow overflow-hidden">
        {/* Score header */}
        <div
          className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <h3 className="font-medium">Scorecard</h3>
            <span className="ml-2 text-sm bg-gray-100 px-2 py-0.5 rounded">
              {isExpanded ? 'Hide details' : 'Show details'}
            </span>
          </div>
          <div className="text-gray-500">{isExpanded ? <p> V </p> : <> ^ </>}</div>
        </div>

        {/* Compact score list (always visible) */}
        <div className="border-t px-3 py-2 bg-gray-50">
          <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium"
              >
                {['1', '4', 'W', '6', 'Wd', 'Nb', '1', '0', '2', 'W', '4', '1'][i]}
              </div>
            ))}
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className="border-t">
            <div className="bg-gray-50 p-2 border-b flex">
              <span className="w-20 font-medium text-sm">Over</span>
              <span className="flex-1 font-medium text-sm">Batsman</span>
              <span className="w-24 font-medium text-right text-sm">Runs</span>
            </div>
            <div className="overflow-y-auto max-h-64">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="p-2 flex items-center hover:bg-gray-50 border-b">
                  <span className="w-20 text-xs text-gray-500">
                    {Math.floor(i / 6)}.{(i % 6) + 1}
                  </span>
                  <span className="flex-1 text-sm">
                    {'Ben Stokes'} to {['Pat Cummins', 'David Warner'][i % 2]}
                  </span>
                  <span
                    className={`w-24 text-right font-mono ${
                      [
                        '1',
                        '1',
                        'W',
                        '4',
                        '6',
                        'Wd+1',
                        'Nb+1',
                        '0',
                        '2',
                        '1',
                        'W',
                        '4',
                        '1',
                        '0',
                        '1',
                        'W',
                        '6',
                        '4',
                        '1',
                        'W',
                      ][i] === 'W'
                        ? 'text-red-600'
                        : 'text-gray-800'
                    }`}
                  >
                    {
                      [
                        '1',
                        '1',
                        'W',
                        '4',
                        '6',
                        'Wd+1',
                        'Nb+1',
                        '0',
                        '2',
                        '1',
                        'W',
                        '4',
                        '1',
                        '0',
                        '1',
                        'W',
                        '6',
                        '4',
                        '1',
                        'W',
                      ][i]
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
    </>
  );
};
