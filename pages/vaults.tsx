import React, { useState, useEffect } from "react";

import BigNumber from "bignumber.js";

import useWallet from "hooks/useWallet";
import { FormatValue } from "../types";

import { AddLiquidity, RemoveLiquidity } from "../components/Vaults";
import {
  ModalContainer,
  ContentSelectVault,
  ContentAddLiquidity,
} from "../components/Modal";
import Notification from "../components/Notification";

import { runningStatus } from "../utils/constants";

import cn from "classname";
import { compare } from "utils/number";

type VAULTS_TAB_TYPE = "add" | "remove";

export default function Vaults({ library, state, dispatch, connectWallet }) {

  const [tab, setTab] = useState<VAULTS_TAB_TYPE>("add");

  const [modalVaultSelect, setModalVaultSelect] = useState(false);
  const [modalConfirmAdd, setModalConfirmAdd] = useState(false);

  const [depositAmountOne, setDepositAmountOne] = useState<FormatValue>({
    value: new BigNumber(0),
    format: "0",
  });
  const [depositAmountTwo, setDepositAmountTwo] = useState<FormatValue>({
    value: new BigNumber(0),
    format: "0",
  });

  const [status, setStatus] = useState(runningStatus.STATUS_IDLE);
  const [message, setMessage] = useState("");

  const handleAddLiquidity = async () => {
    setModalConfirmAdd(false);

    setStatus(runningStatus.STATUS_LOADING);

    // Check USDT allowance
    const usdtAllowance = await library.methods
      .Market(library.addresses.USDT_TOKEN)
      .getAllowance(state.account.address, library.addresses.CELLAR_WETH_USDT);

    if (compare(usdtAllowance, depositAmountTwo.value) < 0) {
      const usdtApproveTransaction = library.methods
        .Market(library.addresses.USDT_TOKEN)
        .approve(
          library.addresses.CELLAR_WETH_USDT,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          { from: state.account.address },
        );

      const usdtApproveTransactionResult = await usdtApproveTransaction.send()

      // Approve failure
      if (usdtApproveTransactionResult.status === false) {
        setStatus(runningStatus.STATUS_ERROR)
        return
      }
    }

    // Run AddLiquidityV3
    const block = await library.web3.eth.getBlock('latest');
    const timestamp = block.timestamp + (60 * 20);    // 20 Mins

    // const params = {
    //   amount0Desired: new BigNumber(depositAmountOne.value).toString(10),
    //   amount1Desired: new BigNumber(depositAmountTwo.value).toString(10),
    //   amount0Min: 0,
    //   amount0Max: 0,
    //   deadline: timestamp
    // }

    const params = [
      new BigNumber(depositAmountOne.value).toString(10),
      new BigNumber(depositAmountTwo.value).toString(10),
      0,
      0,
      timestamp
    ]

    const transaction = library.methods.cellarWethUsdt.addLiquidityForUniV3(
      params,
      { 
        from: state.account.address,
        value: library.web3.utils.toWei(depositAmountOne.value.toString(), "wei"),
      }
    )

    try {
      console.log(transaction)
      const transactionResult = await transaction.send()
      console.log(transactionResult)

      if (transactionResult.status) {
        setStatus(runningStatus.STATUS_SUCCESS);
      } else {
        setStatus(runningStatus.STATUS_ERROR);
      }
    } catch (e) {
      console.log('--------------------------------------', e.code)
      console.log(e)
      if ('code' in e && e.code === 4001) {
        setStatus(runningStatus.STATUS_IDLE)
      }
    }
  };

  useEffect(() => {
    if (status === runningStatus.STATUS_SUCCESS || status === runningStatus.STATUS_ERROR) {
      setTimeout(() => {
        setStatus(runningStatus.STATUS_IDLE)
      }, 3000)
    }
  }, [status])

  return (
    <div className="vaults-container">
      <div className="vaults-title">
        <h1>vaults</h1>
      </div>
      <div className="vaults-tab-menu">
        <div
          className={cn("vaults-tab-menu-item", { active: tab === "add" })}
          role="button"
          onClick={(e) => setTab("add")}
        >
          Add
        </div>
        <div
          className={cn("vaults-tab-menu-item", { active: tab === "remove" })}
          role="button"
          onClick={(e) => setTab("remove")}
        >
          Remove
        </div>
      </div>
      <div className="vaults-tab-content">
        {tab === "add" && (
          <AddLiquidity
            onSelectVault={() => setModalVaultSelect(true)}
            onAddLiquidity={(one, two) => {
              setDepositAmountOne(one);
              setDepositAmountTwo(two);
              setModalConfirmAdd(true);
            }}
            library={library}
            state={state}
            onConnectWallet={connectWallet}
            status={status}
          />
        )}
        {tab === "remove" && (
          <RemoveLiquidity
            library={library}
            state={state}
            onConnectWallet={connectWallet}
          />
        )}
      </div>
      {modalVaultSelect && (
        <ModalContainer onClose={(e) => setModalVaultSelect(false)}>
          <ContentSelectVault />
        </ModalContainer>
      )}
      {modalConfirmAdd && (
        <ModalContainer onClose={(e) => setModalConfirmAdd(false)}>
          <ContentAddLiquidity
            onConfirm={() => handleAddLiquidity()}
            amountOne={depositAmountOne}
            amountTwo={depositAmountTwo}
          />
        </ModalContainer>
      )}
      {status !== 0 && <Notification status={status} />}
    </div>
  );
}
