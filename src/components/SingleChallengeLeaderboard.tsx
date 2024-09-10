import { useState, useEffect } from "react";
import algorandLogo from "../assets/algorand_logo_mark_black.svg";
import "../App.css";
import { isMaskedAddress, isMaskedBlock } from "../config";

type row = { address: string; confirmedRound: number; timeStamp: number };

export const SingleChallengeLeaderboard = ({
  fetchLeaderboard,
  challengeName,
}: {
  fetchLeaderboard: () => Promise<row[]>;
  challengeName: string;
}) => {
  const [rows, setRows] = useState<row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const rows = await fetchLeaderboard();
        setRows(rows);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <div className="main">
        
        <h2>{challengeName} Leaderboard [TESTNET]</h2>
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
              {rows &&
                rows.map((row, index) => {
                  return (
                    <tr className="row" key={row.address}>
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
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
