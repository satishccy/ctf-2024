import { useState, useEffect } from "react";
import "../App.css";
import {
  isMaskedAddress,
  isMaskedBlock,
  markInvalidSubmissions,
} from "../config";
import { ToggleSwitch } from "./ToggleSwitch";
type row = {
  address: string;
  confirmedRound: number;
  timeStamp: number;
  isValidSubmission: boolean;
};

export const SingleChallengeLeaderboard = ({
  fetchLeaderboard,
  challengeName,
  startTime,
  endTime,
}: {
  fetchLeaderboard: (startTime: number, endTime: number) => Promise<row[]>;
  challengeName: string;
  startTime: number;
  endTime: number;
}) => {
  const [rows, setRows] = useState<row[]>([]);
  const [entriesToDisplay, setEntriesToDisplay] = useState<row[]>([]);
  // const entriesToDisplay = showAll ? allEntries : allEntries.slice(0, 10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Display either the top 10 entries or all entries

  useEffect(() => {
    (async () => {
      document.title = `${challengeName} Leaderboard [TESTNET] - Algobharat CTF 2024`;
      try {
        const rows = await fetchLeaderboard(startTime, endTime);
        setRows(rows);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    })();
  }, [fetchLeaderboard, startTime, endTime, challengeName]);

  useEffect(() => {
    setEntriesToDisplay(showAll ? rows : rows.slice(0, 10));
  }, [rows, showAll]);

  return (
    <>
      <div className="main">
        <h2>
          {challengeName}
          {showAll ? "" : " Top 10"} Leaderboard [TESTNET]
        </h2>
        <div>
          <div style={{ marginBottom: "16px" }} className="time-info">
            <p style={{ margin: "6px 0px" }}>
              Start Time:{" "}
              {new Date(startTime * 1000)
                .toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })
                .replace(",", "")}
            </p>
            <p style={{ margin: "6px 0px" }}>
              End Time:{" "}
              {endTime != 0
                ? new Date(endTime * 1000)
                    .toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })
                    .replace(",", "")
                : "Not Ended Yet"}
            </p>
          </div>
          {markInvalidSubmissions ? (
            <p className="late-entries-message">
              **Entries with gray color are valid, but not considered as they
              were submitted after the end time.
            </p>
          ) : null}
        </div>
        <div className="table-wrapper">
          <table id="leaderboard" className="row">
            <thead>
              <tr className="row">
                <th className="row">#</th>
                <th className="row">Address</th>
                <th className="row">Timestamp</th>
                {isMaskedBlock ? "" : <th className="row">Block No</th>}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="row">
                  <td colSpan={4}>Loading...</td>
                </tr>
              )}
              {error && (
                <tr className="row">
                  <td colSpan={4}>{error}</td>
                </tr>
              )}
              {entriesToDisplay &&
                entriesToDisplay.map((row, index) => (
                  <tr
                    className={`row ${
                      markInvalidSubmissions && !row.isValidSubmission
                        ? "invalid"
                        : ""
                    }`}
                    key={row.address}
                  >
                    <td className="placing-1 row">{index + 1}</td>
                    <td className="row">
                      {!isMaskedAddress
                        ? row.address
                        : row.address.slice(0, 50) + "*".repeat(8)}
                    </td>
                    <td className="row">
                      {new Date(row.timeStamp * 1000)
                        .toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })
                        .replace(",", "")}
                    </td>
                    {isMaskedBlock ? (
                      ""
                    ) : (
                      <td className="row">{row.confirmedRound}</td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
          {rows.length > 10 && (
            <div>
              <label
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <ToggleSwitch
                  checked={showAll}
                  onChange={() => setShowAll(!showAll)}
                />
                {"Show All Entries"}
              </label>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
