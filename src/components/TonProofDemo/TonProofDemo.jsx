import React, { useEffect, useState } from "react";
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
  const [proof, setProof] = useState(null);

  useEffect(() => {
    if (!proof) {
      return;
    }
    if (!address) {
      return;
    }
    const doJob = async () => {
      await TonProofDemoApi.checkProof(proof.proof, {
        ...proof.account,
        friendlyAddress: address,
      });
    };
    doJob();
  }, [address, proof]);

  useEffect(() => {
    tonConnectUI.onStatusChange(async (w) => {
      if (!w || w.account.chain === CHAIN.TESTNET) {
        return;
      }

      if (w.connectItems.tonProof.proof) {
        setProof({ proof: w.connectItems.tonProof.proof, account: w.account });
      }
    });
  }, [tonConnectUI]);

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
    </div>
  );
};
