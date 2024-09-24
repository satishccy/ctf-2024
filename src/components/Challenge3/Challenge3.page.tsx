import { Challenge3Logic } from "./Challenge3.logic";
import { SingleChallengeLeaderboard } from "../SingleChallengeLeaderboard";

export const Challenge3Page = () => {
  return (
    <>
      <SingleChallengeLeaderboard
        fetchLeaderboard={Challenge3Logic}
        challengeName="Challenge 3"
        startTime={1727147940}
        endTime={0}
      />
    </>
  );
};
