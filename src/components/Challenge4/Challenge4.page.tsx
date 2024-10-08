import { Challenge4Logic } from "./Challenge4.logic";
import { SingleChallengeLeaderboard } from "../SingleChallengeLeaderboard";

export const Challenge4Page = () => {
  return (
    <>
      <SingleChallengeLeaderboard
        fetchLeaderboard={Challenge4Logic}
        challengeName="Challenge 4"
        startTime={1728362580}
        endTime={0}
      />
    </>
  );
};
