import { useParams } from 'react-router';
import { useState } from 'react';
import { players } from '~/data/players';
import { Scoring } from '~/components/match/Scoring';
import { PlayerSelector } from '~/components/match/PlayerSelector';
import { Scorecard } from '~/components/match/Scorecard';
import { ExtraScoringModal } from '~/components/match/ExtraScoringModal';
import { ScoreHistory } from '~/components/match/ScoreHistory';
import type { IBallHistory } from '~/types';

export default function Match() {
  const { seriesName } = useParams<{ seriesName: string }>();
  const [striker, setStriker] = useState<string | null>(null);
  const [nonStriker, setNonStriker] = useState<string | null>(null);
  const [bowler, setBowler] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [showRunPrompt, setShowRunPrompt] = useState<{ type: 'wide' | 'noBall' | null }>({
    type: null,
  });
  const [extraRuns, setExtraRuns] = useState(0);
  const [currentOver, setCurrentOver] = useState(0);
  const [ballsInOver, setBallsInOver] = useState(0);
  const [ballHistory, setBallHistory] = useState<Array<IBallHistory>>([]);

  const handleRun = (runs: number, type: 'run' | 'wide' | 'noBall' | 'wicket' = 'run') => {
    setScore((prev) => prev + runs);

    // Update ball tracking for valid deliveries (not wides or no-balls)
    if (type === 'run' || type === 'wicket') {
      const newBallsInOver = (ballsInOver + 1) % 6;
      setBallsInOver(newBallsInOver);
      if (newBallsInOver === 0) {
        setCurrentOver((prev) => prev + 1);
      }
    }

    // Add to ball history
    setBallHistory((prev) => [
      ...prev,
      {
        type,
        runs,
        ballNumber: ballsInOver + 1,
        overNumber: currentOver,
        striker: striker || undefined,
        nonStriker: nonStriker || undefined,
        bowler: bowler || undefined,
      },
    ]);
  };

  const handleWicket = () => {
    handleRun(0, 'wicket');
    setWickets((prev) => prev + 1);
  };

  const handleExtraWithRuns = (type: 'wide' | 'noBall' | null, runs: number) => {
    if (!type) {
      setShowRunPrompt({ type: null });
      return;
    }

    // For wides, the first run is the extra, any additional runs are added to the total
    const extraRun = type === 'wide' ? 1 : 0; // No ball already adds 1 run automatically
    const totalRuns = extraRun + runs;

    // Update the score
    setScore((prev) => prev + totalRuns);

    // Add to ball history
    setBallHistory((prev) => [
      ...prev,
      {
        type,
        runs: totalRuns,
        ballNumber: ballsInOver + 1,
        overNumber: currentOver,
        striker: striker || undefined,
        nonStriker: nonStriker || undefined,
        bowler: bowler || undefined,
      },
    ]);

    // Close the run prompt
    setShowRunPrompt({ type: null });
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50 flex flex-col">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">{seriesName} - Innings</h1>

      {/* Player Selection */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
        <PlayerSelector players={players} player={striker} setPlayer={setStriker} label="Striker" />
        <PlayerSelector
          players={players}
          player={nonStriker}
          setPlayer={setNonStriker}
          label="Non Striker"
        />
        <PlayerSelector players={players} player={bowler} setPlayer={setBowler} label="Bowler" />
      </div>

      {/* Score Display */}
      <Scorecard
        score={score}
        wickets={wickets}
        currentOver={currentOver}
        ballsInOver={ballsInOver}
      />
      {/* Current match summary */}
      <div className="mt-4 pt-3 border-t"></div>

      {/* Quick Scoring Buttons */}
      <Scoring
        handleRun={handleRun}
        handleWicket={handleWicket}
        setExtraRuns={setExtraRuns}
        setShowRunPrompt={setShowRunPrompt}
      />

      {/* Run Prompt Overlay */}
      {showRunPrompt.type && (
        <ExtraScoringModal
          extraRuns={extraRuns}
          setExtraRuns={setExtraRuns}
          showRunPrompt={showRunPrompt}
          setShowRunPrompt={setShowRunPrompt}
          handleExtraWithRuns={handleExtraWithRuns}
        />
      )}

      <ScoreHistory ballHistory={ballHistory} />
    </div>
  );
}
