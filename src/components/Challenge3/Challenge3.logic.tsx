import * as algosdk from "algosdk";
type row = {
  address: string;
  confirmedRound: number;
  timeStamp: number;
  isValidSubmission: boolean;
};

export async function Challenge3Logic(startTime: number, endTime: number) {
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
    .afterTime(new Date(startTime * 1000).toISOString())
    .do();
  const decoder = new TextDecoder();

  for (let i = 0; i < response.transactions.length; i++) {
    const tx = response.transactions[i];
    const sender: string = tx.sender;
    const isValidSubmission = tx.roundTime
      ? tx.roundTime >= startTime && endTime != 0
        ? tx.roundTime <= endTime
        : true
      : false;
    if (tx.paymentTransaction) {
      if (
        Number(tx.paymentTransaction.amount) == algosdk.algosToMicroalgos(1) &&
        tx.paymentTransaction.receiver ==
          "2JAZQO6Z5BCXFMPVW2CACK2733VGKWLZKS6DGG565J7H5NH77JNHLIIXLY" &&
        (decoder.decode(tx.note).toLowerCase() ==
          "ae6ebfcff2e1d10cafb51c0e4ab77da22838436dd3b5d82b7d2eb6104bd30dc3" ||
          decoder.decode(tx.note).toLowerCase() ==
            "b966c3d07e17b9442740dd2386e6e1ab191d51e964cee3b4dfc122f0fa865d10")
      ) {
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
      .lookupAccountTransactions(
        "2JAZQO6Z5BCXFMPVW2CACK2733VGKWLZKS6DGG565J7H5NH77JNHLIIXLY"
      )
      .txType("pay")
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
      if (tx.paymentTransaction) {
        if (
          Number(tx.paymentTransaction.amount) ==
            algosdk.algosToMicroalgos(1) &&
          tx.paymentTransaction.receiver ==
            "2JAZQO6Z5BCXFMPVW2CACK2733VGKWLZKS6DGG565J7H5NH77JNHLIIXLY" &&
          (decoder.decode(tx.note).toLowerCase() ==
            "ae6ebfcff2e1d10cafb51c0e4ab77da22838436dd3b5d82b7d2eb6104bd30dc3" ||
            decoder.decode(tx.note).toLowerCase() ==
              "b966c3d07e17b9442740dd2386e6e1ab191d51e964cee3b4dfc122f0fa865d10")
        ) {
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
  const rowsReversed = rows.reverse();
  const rowsFilterd = rowsReversed.filter((row) => {
    if (!accounts.includes(row.address)) {
      accounts.push(row.address);
      return true;
    }
    return false;
  });
  return rowsFilterd;
}
