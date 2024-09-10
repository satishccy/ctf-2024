import * as algosdk from "algosdk";
type row = { address: string; confirmedRound: number; timeStamp: number };

export async function Challenge1Logic() {
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
  for (let i = 0; i < response.transactions.length; i++) {
    const tx = response.transactions[i];
    const sender: string = tx.sender;
    if (
      tx["payment-transaction"]["amount"] == algosdk.algosToMicroalgos(1) &&
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
    for (let i = 0; i < response.transactions.length; i++) {
      const tx = response.transactions[i];
      const sender: string = tx.sender;
      if (
        tx["payment-transaction"]["amount"] == algosdk.algosToMicroalgos(1) &&
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
  return rows.reverse();
}
