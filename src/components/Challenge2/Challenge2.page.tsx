import { Challenge2Logic } from "./Challenge2.logic";
import { SingleChallengeLeaderboard } from "../SingleChallengeLeaderboard";

export const Challenge2Page = () => {
  return (
    <>
      <SingleChallengeLeaderboard
        fetchLeaderboard={Challenge2Logic}
        challengeName="Challenge 2"
        startTime={1725943380}
        endTime={1726756200}
      />
    </>
  );
};
