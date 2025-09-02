export const Scorecard = ({
  score,
  wickets,
  currentOver,
  ballsInOver,
}: {
  score: number;
  wickets: number;
  currentOver: number;
  ballsInOver: number;
}) => {
  return (
    <div className="text-center text-xl md:text-2xl font-bold mb-6">
      <div className="flex justify-between items-center">
        <div>
          Score: {score} / {wickets}
        </div>
        <div className="text-lg font-bold">
          Overs: {currentOver}.{ballsInOver}
        </div>
      </div>
    </div>
  );
};
