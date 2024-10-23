import { Challenge5Logic } from "./Challenge5.logic";
import { SingleChallengeLeaderboard } from "../SingleChallengeLeaderboard";

export const Challenge5Page = () => {
  return (
    <>
      <SingleChallengeLeaderboard
        fetchLeaderboard={Challenge5Logic}
        challengeName="Challenge 5"
        startTime={1729608180}
        endTime={0}
      />
    </>
  );
};
