import { useParams } from "react-router";
import { useState } from "react";
import { players } from "~/data/players";



export default function Match() {
    const { seriesName } = useParams<{ seriesName: string }>();
    const [batsman, setBatsman] = useState<string | null>(null);
    const [bowler, setBowler] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [wickets, setWickets] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showRunPrompt, setShowRunPrompt] = useState<{type: 'wide' | 'noBall' | null}>({type: null});
    const [extraRuns, setExtraRuns] = useState(0);
    const [currentOver, setCurrentOver] = useState(0);
    const [ballsInOver, setBallsInOver] = useState(0);
    const [ballHistory, setBallHistory] = useState<Array<{
        type: 'run' | 'wide' | 'noBall' | 'wicket',
        runs: number,
        ballNumber: number,
        overNumber: number,
        batsman?: string,
        bowler?: string
    }>>([]);

    const handleRun = (runs: number, type: 'run' | 'wide' | 'noBall' | 'wicket' = 'run') => {
        setScore(prev => prev + runs);
        
        // Update ball tracking for valid deliveries (not wides or no-balls)
        if (type === 'run' || type === 'wicket') {
            const newBallsInOver = (ballsInOver + 1) % 6;
            setBallsInOver(newBallsInOver);
            if (newBallsInOver === 0) {
                setCurrentOver(prev => prev + 1);
            }
        }
        
        // Add to ball history
        setBallHistory(prev => [
            ...prev,
            {
                type,
                runs,
                ballNumber: ballsInOver + 1,
                overNumber: currentOver,
                batsman: batsman || undefined,
                bowler: bowler || undefined
            }
        ]);
    };

    const handleWicket = () => {
        handleRun(0, 'wicket');
        setWickets(prev => prev + 1);
    };
    
    const handleExtraWithRuns = (type: 'wide' | 'noBall' | null, runs: number) => {
        if (!type) {
            setShowRunPrompt({type: null});
            return;
        }
        
        // For wides, the first run is the extra, any additional runs are added to the total
        const extraRun = type === 'wide' ? 1 : 0; // No ball already adds 1 run automatically
        const totalRuns = extraRun + runs;
        
        // Update the score
        setScore(prev => prev + totalRuns);
        
        // Add to ball history
        setBallHistory(prev => [
            ...prev,
            {
                type,
                runs: totalRuns,
                ballNumber: ballsInOver + 1,
                overNumber: currentOver,
                batsman: batsman || undefined,
                bowler: bowler || undefined
            }
        ]);
        
        // Close the run prompt
        setShowRunPrompt({type: null});
    };

    return (
        <div className="p-4 min-h-screen bg-gray-50 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
                {seriesName} - Innings
            </h1>

            {/* Player Selection */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
                <div>
                    <label className="block font-semibold mb-1">Batsman</label>
                    <select
                        value={batsman || ""}
                        onChange={e => setBatsman(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="" disabled>Select Batsman</option>
                        {players.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1">Bowler</label>
                    <select
                        value={bowler || ""}
                        onChange={e => setBowler(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="" disabled>Select Bowler</option>
                        {players.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Score Display */}
            <div className="text-center text-xl md:text-2xl font-bold mb-6">
                Score: {score} / {wickets}
            </div>

            {/* Quick Scoring Buttons */}
            <div className="grid grid-cols-3 gap-4 md:grid-cols-6 mb-6">
                {[0, 1, 2, 3, 4, 6].map(run => (
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
                <div key={'Dot'} className="relative">
                    <button
                        onClick={() => {
                            handleRun(0);
                        }}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 transition"
                    >
                        {'Dot'}
                    </button>
                </div>
                {['Wide', 'No Ball'].map(type => {
                    const extraType = type.toLowerCase().replace(' ', '') as 'wide' | 'noBall';
                    return (
                        <div key={type} className="relative">
                            <button
                                onClick={() => {
                                    setExtraRuns(extraType === 'wide' ? 1 : 0);
                                    setShowRunPrompt({type: extraType});
                                }}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 transition"
                            >
                                {type}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Current match summary */}
            <div className="mt-4 pt-3 border-t">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-gray-600">Overs: </span>
                        <span className="font-medium">3.2</span>
                    </div>
                    <div className="text-lg font-bold">
                        {score}/{wickets}
                    </div>
                </div>
            </div>

            {/* Run Prompt Overlay */}
            {showRunPrompt.type && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <h3 className="text-lg font-medium mb-4">
                            Runs on {showRunPrompt.type === 'wide' ? 'Wide' : 'No Ball'}:
                        </h3>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {[0, 1, 2, 3, 4, 6].map(run => (
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
            )}
            
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
                    <div className="text-gray-500">
                        {isExpanded ? <p> V </p> : <> ^ </>}
                    </div>
                </div>

                {/* Compact score list (always visible) */}
                <div className="border-t px-3 py-2 bg-gray-50">
                    <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium">
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
                                        {Math.floor(i/6)}.{i%6 + 1}
                                    </span>
                                    <span className="flex-1 text-sm">
                                        {['Player 1', 'Player 2'][i % 2]}
                                    </span>
                                    <span className={`w-24 text-right font-mono ${
                                        ['W', 'W', '1', '4', '6', 'Wd+1', 'Nb+1', '0', '2', '1', 'W', '4', '1', '0', '1', 'W', '6', '4', '1', 'W'][i] === 'W' 
                                            ? 'text-red-600' 
                                            : 'text-gray-800'
                                    }`}>
                                        {['W', 'W', '1', '4', '6', 'Wd+1', 'Nb+1', '0', '2', '1', 'W', '4', '1', '0', '1', 'W', '6', '4', '1', 'W'][i]}
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
        </div>
    );
}
