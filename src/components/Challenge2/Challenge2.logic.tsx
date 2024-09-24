import * as algosdk from "algosdk";
type row = {
  address: string;
  confirmedRound: number;
  timeStamp: number;
  isValidSubmission: boolean;
};

export async function Challenge2Logic(startTime: number, endTime: number) {
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
    .afterTime(new Date(startTime * 1000).toISOString())
    .do();
  for (let i = 0; i < response.transactions.length; i++) {
    const tx = response.transactions[i];
    const sender: string = tx.sender;
    const isValidSubmission = tx.roundTime
      ? tx.roundTime >= startTime && endTime != 0
        ? tx.roundTime <= endTime
        : true
      : false;
    if (tx.assetTransferTransaction) {
      if (Number(tx.assetTransferTransaction.amount) == 0) {
        rows.push({
          address: sender,
          confirmedRound: Number(tx.confirmedRound),
          timeStamp: Number(tx.roundTime),
          isValidSubmission,
        });
      }
    }
  }
  while (response.nextToken) {
    response = await indexerClient
      .lookupAssetTransactions(assetId)
      .txType("axfer")
      .sigType("sig")
      .nextToken(response.nextToken)
      .do();
    for (let i = 0; i < response.transactions.length; i++) {
      const tx = response.transactions[i];
      const sender: string = tx.sender;
      const isValidSubmission = tx.roundTime
        ? tx.roundTime >= startTime && tx.roundTime <= endTime
        : false;
      if (tx.assetTransferTransaction) {
        if (Number(tx.assetTransferTransaction.amount) == 0) {
          rows.push({
            address: sender,
            confirmedRound: Number(tx.confirmedRound),
            timeStamp: Number(tx.roundTime),
            isValidSubmission,
          });
        }
      }
    }
  }
  const rowsFilterd = rows.filter((row) => {
    if (!accounts.includes(row.address)) {
      accounts.push(row.address);
      return true;
    }
    return false;
  });
  return rowsFilterd;
}
