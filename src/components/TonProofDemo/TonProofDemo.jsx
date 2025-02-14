import React, { useEffect } from "react";
import "./style.scss";
import { TonProofDemoApi } from "../../TonProofDemoApi";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useTonAddress } from "@tonconnect/ui-react";
import { CHAIN } from "@tonconnect/ui-react";
import { TonConnectButton } from "@tonconnect/ui-react";

export const TonProofDemo = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const address = useTonAddress(true);

  useEffect(
    () =>
      tonConnectUI.onStatusChange(async (w) => {
        if (!w || w.account.chain === CHAIN.TESTNET) {
          TonProofDemoApi.reset();
          setAuthorized(false);
          return;
        }

        if (w.connectItems.tonProof.proof && address) {
          await TonProofDemoApi.checkProof(w.connectItems.tonProof.proof, {
            ...w.account,
            friendlyAddress: address,
          });
        }
      }),
    [tonConnectUI]
  );

  const auth = async () => {
    setTimeout(async () => {
      const payload = await TonProofDemoApi.generatePayload();

      if (payload) {
        tonConnectUI.setConnectRequestParameters({
          state: "ready",
          value: payload,
        });
      }
    }, 700);
  };
  useEffect(() => {
    auth();
  }, [wallet]);

  return (
    <div className="ton-proof-demo">
      <h3>NEST-FRONT-EXAMPLE</h3>
      <TonConnectButton />

      {JSON.stringify(wallet)}
    </div>
  );
};
