interface ScoringProps {
  handleRun: (runs: number) => void;
  handleWicket: () => void;
  setExtraRuns: (runs: number) => void;
  setShowRunPrompt: (show: { type: 'wide' | 'noBall' }) => void;
}

export const Scoring = ({
  handleRun,
  handleWicket,
  setExtraRuns,
  setShowRunPrompt,
}: ScoringProps) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-6 mb-6">
        {[0, 1, 2, 3, 4, 6].map((run) => (
          <button
            key={run}
            onClick={() => handleRun(run)}
            className="bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            {run}
          </button>
        ))}
        <button
          onClick={handleWicket}
          className="bg-red-600 text-white py-3 rounded-lg text-lg hover:bg-red-700 transition col-span-3 md:col-span-2"
        >
          Wicket
        </button>
      </div>
      {/* Quick Scoring Buttons */}
      <div className="grid grid-cols-3 gap-4 md:grid-cols-6 mb-6">
        {['Wide', 'No Ball'].map((type) => {
          const extraType = type.toLowerCase().replace(' ', '') as 'wide' | 'noBall';
          return (
            <div key={type} className="relative">
              <button
                onClick={() => {
                  setExtraRuns(extraType === 'wide' ? 1 : 0);
                  setShowRunPrompt({ type: extraType });
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 transition"
              >
                {type}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};
