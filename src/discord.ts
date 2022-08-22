import axios from 'axios';

export default class Discord {
  private baseUrl: string;
  public accessAddress: string;
  public signature: string;
  public signatureData: any;

  constructor(
    baseUrl: string,
    accessAddress: string,
    signature: string,
    signatureData: any
  ) {
    this.baseUrl = `${baseUrl}/discord`;
    this.accessAddress = accessAddress;
    this.signature = signature;
    this.signatureData = signatureData;
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = `${baseUrl}/discord`;
  }

  connectDiscordWithApp(
    appId: string,
    discordServerId: string,
    userId: string,
  ) {
    return axios
      .post(`${this.baseUrl}/register`, {
        appId,
        discordServerId,
        userId,
        signature: this.signature,
        data: this.signatureData,
        accessAinAddress: this.accessAddress,
      })
      .then((res) => res.data)
      .catch((e) => {
        throw e.response.data;
      });
  }
}
