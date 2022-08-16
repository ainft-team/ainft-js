export interface ConnectAppParams {
  appId: string;
  discordServerId: string;
  userId: string;
  signature: string;
  signatureData: string;
  accessAinAddress: string;
};

export interface Account {
  address: string;
  privateKey: string;
  publicKey?: string;
}