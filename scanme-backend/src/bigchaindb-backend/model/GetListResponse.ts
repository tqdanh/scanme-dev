export class GetListResponse {
    constructor() {
    }

    public transactionId: string;
    public outputIndex: number;
    public spentStatus: boolean;
    public currentPublicKey: string;
    public amount: string;
    public metaData: object;
    public assetId: string;
    public creatorPublicKey: string;
    public assetData: object;
}
