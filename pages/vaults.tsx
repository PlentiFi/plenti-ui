import React, { useState } from "react";

import useWallet from "hooks/useWallet";

import { AddLiquidity, RemoveLiquidity } from "../components/Vaults";
import {
  ModalContainer,
  ContentSelectVault,
  ContentAddLiquidity,
} from "../components/Modal";

import cn from "classname";

type VAULTS_TAB_TYPE = "add" | "remove";

export default function Vaults({ library, state, dispatch }) {
  const [, connectWallet] = useWallet(dispatch);

  const [tab, setTab] = useState<VAULTS_TAB_TYPE>("add");

  const [modalVaultSelect, setModalVaultSelect] = useState(false);
  const [modalConfirmAdd, setModalConfirmAdd] = useState(false);

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
            onAddLiquidity={(e) => setModalConfirmAdd(true)}
            library={library}
            state={state}
            onConnectWallet={connectWallet}
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
          <ContentAddLiquidity onConfirm={() => setModalConfirmAdd(false)} />
        </ModalContainer>
      )}
    </div>
  );
}
