import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactJson from "react-json-view";
import "./style.scss";
import { TonProofDemoApi } from "../../TonProofDemoApi";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { CHAIN } from "@tonconnect/ui-react";

export const TonProofDemo = () => {
  const [data, setData] = useState({});
  const wallet = useTonWallet();
  const [authorized, setAuthorized] = useState(false);
  const [tonConnectUI] = useTonConnectUI();

  useEffect(
    () =>
      tonConnectUI.onStatusChange(async (w) => {
        if (!w || w.account.chain === CHAIN.TESTNET) {
          TonProofDemoApi.reset();
          setAuthorized(false);
          return;
        }

        if (w.connectItems.tonProof.proof) {
          await TonProofDemoApi.checkProof(
            w.connectItems.tonProof.proof,
            w.account
          );
        }

        // if (!TonProofDemoApi.accessToken) {
        //   tonConnectUI.disconnect();
        //   setAuthorized(false);
        //   return;
        // }

        // setAuthorized(true);
      }),
    [tonConnectUI]
  );

  const auth = async () => {
    setTimeout(async () => {
      const payload = await TonProofDemoApi.generatePayload();

      if (payload) {
        console.log("PAYLOAD:", payload);
        tonConnectUI.setConnectRequestParameters({
          state: "ready",
          value: payload,
        });
      }
    }, 700);
  };
  useEffect(() => {
    auth();
  }, []);

  const handleClick = useCallback(async () => {
    if (!wallet) {
      return;
    }
    const response = await TonProofDemoApi.getAccountInfo(wallet.account);

    setData(response);
  }, [wallet]);

  return (
    <div className="ton-proof-demo">
      <h3>Demo backend API with ton_proof verification</h3>

      {/* <button onClick={auth}>AUTH</button> */}

      <ReactJson src={data} name="response" theme="ocean" />
    </div>
  );
};
