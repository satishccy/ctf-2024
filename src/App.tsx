import { useState, useEffect } from "react";
import algorandLogo from "./assets/algorand_logo_mark_black.svg";
import * as algosdk from "algosdk";
import "./App.css";

type row = { address: string; confirmedRound: number; timeStamp: number };
function App() {
  const [rows, setRows] = useState<row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const rows: row[] = [];
        const accounts: string[] = [];
        const indexerClient = new algosdk.Indexer(
          "a".repeat(64),
          "https://testnet-idx.algonode.cloud",
          443
        );
        let response = await indexerClient
          .lookupAccountTransactions(
            "2JAZQO6Z5BCXFMPVW2CACK2733VGKWLZKS6DGG565J7H5NH77JNHLIIXLY"
          )
          .txType("pay")
          .sigType("sig")
          .do();
        console.log(response);
        for (let i = 0; i < response.transactions.length; i++) {
          const tx = response.transactions[i];
          const sender: string = tx.sender;
          if (
            tx["payment-transaction"]["amount"] ==
              algosdk.algosToMicroalgos(1) &&
            tx["payment-transaction"]["receiver"] ==
              "2JAZQO6Z5BCXFMPVW2CACK2733VGKWLZKS6DGG565J7H5NH77JNHLIIXLY" &&
            accounts.indexOf(sender) === -1
          ) {
            rows.push({
              address: sender,
              confirmedRound: tx["confirmed-round"],
              timeStamp: tx["round-time"],
            });
          }
        }
        while (response["next-token"]) {
          response = await indexerClient
            .lookupAccountTransactions(
              "2JAZQO6Z5BCXFMPVW2CACK2733VGKWLZKS6DGG565J7H5NH77JNHLIIXLY"
            )
            .txType("pay")
            .sigType("sig")
            .nextToken(response["next-token"])
            .do();
          console.log(response);
          for (let i = 0; i < response.transactions.length; i++) {
            const tx = response.transactions[i];
            const sender: string = tx.sender;
            if (
              tx["payment-transaction"]["amount"] ==
                algosdk.algosToMicroalgos(1) &&
              tx["payment-transaction"]["receiver"] ==
                "2JAZQO6Z5BCXFMPVW2CACK2733VGKWLZKS6DGG565J7H5NH77JNHLIIXLY" &&
              accounts.indexOf(sender) === -1
            ) {
              rows.push({
                address: sender,
                confirmedRound: tx["confirmed-round"],
                timeStamp: tx["round-time"],
              });
            }
          }
        }
        setRows(rows.reverse());
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setLoading(false);
        setError(error.message);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <>
      <div className="main">
        <div className="bg">
          <img src={algorandLogo} alt="Algorand Logo" />
          <h1>Algobharat CTF Challenge 1</h1>
        </div>
        <h2>Leaderboard [TESTNET]</h2>
        <div className="table-wrapper">
          <table id="leaderboard" className="row">
            <tr className="row">
              <th className="row">#</th> <th className="row">Address</th>
              <th className="row">Timestamp</th>
              <th className="row">Block No</th>
            </tr>
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
                    <td className="row">{row.address}</td>
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
                    <td className="row">{row.confirmedRound}</td>
                  </tr>
                );
              })}
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
