export interface CreateProduct {
  contents: {
    productLine: string;
    productDescription: string;
    quantity: string;
    unit: string;
  };
  noteAction: string;
  metaData: {
    contents: object;
    noteAction: string;
  };
  sources?: Array<{productLine: string; transactionId: string; outputIndex: string}>;
}
