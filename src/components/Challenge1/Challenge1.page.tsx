import { Challenge1Logic } from "./Challenge1.logic";
import { SingleChallengeLeaderboard } from "../SingleChallengeLeaderboard";

export const Challenge1Page = () => {
  return (
    <>
      <SingleChallengeLeaderboard
        fetchLeaderboard={Challenge1Logic}
        challengeName="Challenge 1"
        startTime={1725075000}
        endTime={1725546600}
      />
    </>
  );
};
