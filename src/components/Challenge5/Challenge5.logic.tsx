import * as algosdk from "algosdk";
type row = {
  address: string;
  confirmedRound: number;
  timeStamp: number;
  isValidSubmission: boolean;
};

function isEqualBytes(bytes1: Uint8Array, bytes2: Uint8Array): boolean {
  if (bytes1.length !== bytes2.length) {
    return false;
  }

  for (let i = 0; i < bytes1.length; i++) {
    if (bytes1[i] !== bytes2[i]) {
      return false;
    }
  }

  return true;
}

export async function Challenge5Logic(startTime: number, endTime: number) {
  const rows: row[] = [];
  const accounts: string[] = [];
  const indexerClient = new algosdk.Indexer(
    "a".repeat(64),
    "https://testnet-idx.algonode.cloud",
    443
  );

  const applicationId = 724753783;
  const logResponse = new Uint8Array([
    21, 31, 124, 117, 0, 54, 83, 117, 98, 109, 105, 116, 32, 116, 104, 101, 32,
    116, 114, 97, 110, 115, 97, 99, 116, 105, 111, 110, 32, 73, 68, 32, 116,
    111, 32, 116, 104, 101, 32, 112, 114, 111, 118, 105, 100, 101, 100, 32, 103,
    111, 111, 103, 108, 101, 32, 102, 111, 114, 109, 46,
  ]);
  let response = await indexerClient
    .searchForTransactions()
    .applicationID(applicationId)
    .txType("appl")
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
    if (tx.applicationTransaction) {
      if (tx.logs) {
        if (tx.logs.length > 0) {
          if (isEqualBytes(tx.logs[0], logResponse)) {
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
  }
  while (response.nextToken) {
    response = await indexerClient
      .searchForTransactions()
      .applicationID(applicationId)
      .txType("appl")
      .sigType("sig")
      .afterTime(new Date(startTime * 1000).toISOString())
      .nextToken(response.nextToken)
      .do();
    for (let i = 0; i < response.transactions.length; i++) {
      const tx = response.transactions[i];
      const sender: string = tx.sender;
      const isValidSubmission = tx.roundTime
        ? tx.roundTime >= startTime && tx.roundTime <= endTime
        : false;
      if (tx.applicationTransaction) {
        if (tx.logs) {
          if (tx.logs.length > 0) {
            if (isEqualBytes(tx.logs[0], logResponse)) {
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
