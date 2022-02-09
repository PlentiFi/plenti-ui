import React, { useState, useEffect } from "react";
import { Token } from "@uniswap/sdk-core";
import { FeeAmount, Pool } from "@uniswap/v3-sdk";

import BigNumber from "bignumber.js";
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

import { getUniswapV3PoolOverview } from "../utils/uniswap-v3";
import { getPriceFromTick } from "../utils/math";
import mixpanel from 'mixpanel-browser';

mixpanel.init('e761a539fa2591e26b35a98c4ab85338');

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

  /**
   * Pool Initialize
   */
  const [pool, setPool] = useState(null);
  const [poolTick, setPoolTick] = useState({
    tickLower: 0,
    tickUpper: 0,
    currentTick: 0,
  });
  const [priceRange, setPriceRange] = useState({
    min: " ",
    max: " ",
    current: "",
  });
  const [serviceFee, setServiceFee] = useState({
    service: 0,
    owner: 0,
    validator: 0,
  });

  const initPool = async () => {
    const { pool, bundle } = await getUniswapV3PoolOverview(
      library.addresses.UNISWAP_WETH_USDT
    );

    const { ethPriceUSD } = bundle;

    console.log(pool, library.wallet.network, ethPriceUSD);

    const baseTokenCurrency = new Token(
      Number(library.wallet.network),
      pool.token0.id,
      Number(pool.token0.decimals),
      pool.token0.symbol,
      pool.token0.name
    );

    const quoteTokenCurrency = new Token(
      Number(library.wallet.network),
      pool.token1.id,
      Number(pool.token1.decimals),
      pool.token1.symbol,
      pool.token1.name
    );

    const uniPool = new Pool(
      baseTokenCurrency,
      quoteTokenCurrency,
      (parseInt(pool.feeTier, 10) as any) as FeeAmount,
      pool.sqrtPrice,
      pool.liquidity,
      parseInt(pool.tick || "0", 10),
      []
    );

    console.log("uniPool", uniPool);
    const {
      tickLower,
      tickUpper,
    } = await library.methods.cellarWethUsdt.cellarTickInfo(0);

    console.log("tick ************************");
    console.log(tickLower, tickUpper, pool.tick);

    const priceMin = getPriceFromTick(
      tickLower,
      Number(uniPool.token0.decimals),
      Number(uniPool.token1.decimals)
    );
    const priceMax = getPriceFromTick(
      tickUpper,
      Number(uniPool.token0.decimals),
      Number(uniPool.token1.decimals)
    );
    const priceCurrent = getPriceFromTick(
      uniPool.tickCurrent,
      Number(uniPool.token0.decimals),
      Number(uniPool.token1.decimals)
    );

    setPoolTick({
      tickLower,
      tickUpper,
      currentTick: uniPool.tickCurrent,
    });

    setPriceRange({
      min: priceMin,
      max: priceMax,
      current: priceCurrent,
    });

    setCurrentEthPrice(ethPriceUSD);
    setPool(uniPool);

    /**
     * TBD, Currently 0
     */
    const managementFee = await library.methods.cellarWethUsdt.managementFee();
    const performanceFee = await library.methods.cellarWethUsdt.performanceFee();

    setServiceFee({
      service: managementFee,
      owner: managementFee,
      validator: performanceFee,
    });
  };

  /**
   * ==========================================================================================================
   */
  const [currentEthPrice, setCurrentEthPrice] = useState(0);

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
          { from: state.account.address }
        );

      const usdtApproveTransactionResult = await usdtApproveTransaction.send();

      // Approve failure
      if (usdtApproveTransactionResult.status === false) {
        setStatus(runningStatus.STATUS_ERROR);
        return;
      }
    }

    // Run AddLiquidityV3
    const block = await library.web3.eth.getBlock("latest");
    const timestamp = block.timestamp + 60 * 20; // 20 Mins

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
      timestamp,
    ];

    const transaction = library.methods.cellarWethUsdt.addLiquidityForUniV3(
      params,
      {
        from: state.account.address,
        value: library.web3.utils.toWei(
          depositAmountOne.value.toString(),
          "wei"
        ),
      }
    );

    try {
      console.log(transaction);
      const transactionResult = await transaction.send();
      console.log(transactionResult);

      if (transactionResult.status) {
        setStatus(runningStatus.STATUS_SUCCESS);
      } else {
        setStatus(runningStatus.STATUS_ERROR);
      }
    } catch (e) {
      console.log("--------------------------------------", e.code);
      console.log(e);
      if ("code" in e && e.code === 4001) {
        setStatus(runningStatus.STATUS_IDLE);
      }
    }
  };

  useEffect(() => {
    if (
      status === runningStatus.STATUS_SUCCESS ||
      status === runningStatus.STATUS_ERROR
    ) {
      setTimeout(() => {
        setStatus(runningStatus.STATUS_IDLE);
      }, 3000);
    }
  }, [status]);

  useEffect(() => {
    if (state.account.address && library) {
      initPool();
    }
  }, [library, state.account.address]);

  mixpanel.track('Page View', {
    'page': "vaults",
  });

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
            pool={pool}
            poolTick={poolTick}
            priceRange={priceRange}
            serviceFee={serviceFee}
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
            priceRange={priceRange}
            onConfirm={() => handleAddLiquidity()}
            amountOne={depositAmountOne}
            amountTwo={depositAmountTwo}
            ethPrice={currentEthPrice}
          />
        </ModalContainer>
      )}
      {status !== 0 && <Notification status={status} />}
    </div>
  );
}
