import {
  Account,
  ConnectAdditionalRequest,
  TonProofItemReplySuccess,
} from "@tonconnect/ui-react";
import "./patch-local-storage-for-github-pages";
class TonProofDemoApiService {
  private localStorageKey = "demo-api-access-token";

  private host = "http://localhost:5248";

  public accessToken: string | null = null;

  public readonly refreshIntervalMs = 50000;

  constructor() {
    this.accessToken = localStorage.getItem(this.localStorageKey);

    if (!this.accessToken) {
      this.generatePayload();
    }
  }

  async generatePayload(): Promise<ConnectAdditionalRequest | null> {
    try {
      const response = await (
        await fetch(`${this.host}/v2/auth/signin/tonconnect/payload`, {
          method: "GET",
        })
      ).json();
      return { tonProof: response.data.payload as string };
    } catch {
      return null;
    }
  }

  async checkProof(proof: TonProofItemReplySuccess["proof"], account: Account) {
    try {
      const reqBody = {
        rawAddress: account.address,
        network: account.chain,
        friendlyAddress: account.address,

        publicKey: account.publicKey,
        stateinit: account.walletStateInit,
        proof: {
          ...proof,
          state_init: account.walletStateInit,
        },
      };

      console.log(reqBody);

      const response = await (
        await fetch(`${this.host}/v2/auth/signin/tonconnect`, {
          method: "POST",
          body: JSON.stringify(reqBody),

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
      ).json();

      if (response?.token) {
        localStorage.setItem(this.localStorageKey, response.token);
        this.accessToken = response.token;
      }
    } catch (e) {
      console.log("checkProof error:", e);
    }
  }

  async getAccountInfo(account: Account) {
    const response = await (
      await fetch(`${this.host}/dapp/getAccountInfo?network=${account.chain}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      })
    ).json();

    return response as {};
  }

  reset() {
    this.accessToken = null;
    localStorage.removeItem(this.localStorageKey);
    this.generatePayload();
  }
}

export const TonProofDemoApi = new TonProofDemoApiService();
