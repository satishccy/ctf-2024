import * as algosdk from "algosdk";
type row = { address: string; confirmedRound: number; timeStamp: number };

export async function Challenge2Logic() {
  const assetId = 720485937;
  const rows: row[] = [];
  const accounts: string[] = [];
  const indexerClient = new algosdk.Indexer(
    "a".repeat(64),
    "https://testnet-idx.algonode.cloud",
    443
  );
  let response = await indexerClient
    .lookupAssetTransactions(assetId)
    .txType("axfer")
    .sigType("sig")
    .do();
  for (let i = 0; i < response.transactions.length; i++) {
    if (response.transactions[i]["tx-type"] == "axfer") {
      if (response.transactions[i]["asset-transfer-transaction"].amount == 0) {
        if (!accounts.includes(response.transactions[i].sender)) {
          accounts.push(response.transactions[i].sender);
          rows.push({
            address: response.transactions[i].sender,
            confirmedRound: response.transactions[i]["confirmed-round"],
            timeStamp: response.transactions[i]["round-time"],
          });
        }
      }
    }
  }
  while (response["next-token"]) {
    response = await indexerClient
      .lookupAssetTransactions(assetId)
      .txType("axfer")
      .sigType("sig")
      .nextToken(response["next-token"])
      .do();
    for (let i = 0; i < response.transactions.length; i++) {
        if (response.transactions[i]["tx-type"] == "axfer") {
          if (response.transactions[i]["asset-transfer-transaction"].amount == 0) {
            if (!accounts.includes(response.transactions[i].sender)) {
              accounts.push(response.transactions[i].sender);
              rows.push({
                address: response.transactions[i].sender,
                confirmedRound: response.transactions[i]["confirmed-round"],
                timeStamp: response.transactions[i]["round-time"],
              });
            }
          }
        }
      }
  }
  return rows;
}
