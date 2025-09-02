export const ExtraScoringModal = ({
  showRunPrompt,
  setShowRunPrompt,
  extraRuns,
  setExtraRuns,
  handleExtraWithRuns,
}: {
  showRunPrompt: { type: 'wide' | 'noBall' | null };
  setShowRunPrompt: (show: { type: 'wide' | 'noBall' | null }) => void;
  extraRuns: number;
  setExtraRuns: (runs: number) => void;
  handleExtraWithRuns: (type: 'wide' | 'noBall' | null, runs: number) => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-lg font-medium mb-4">
          Runs on {showRunPrompt.type === 'wide' ? 'Wide' : 'No Ball'}:
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[0, 1, 2, 3, 4, 6].map((run) => (
            <button
              key={run}
              onClick={() => setExtraRuns(showRunPrompt.type === 'wide' ? 1 + run : run)}
              className={`p-3 rounded-lg font-medium ${
                (showRunPrompt.type === 'wide' ? run + 1 : run) === extraRuns
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {run}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setShowRunPrompt({ type: null })}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleExtraWithRuns(showRunPrompt.type, extraRuns);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm {extraRuns} run{extraRuns !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};
