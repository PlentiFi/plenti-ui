import React, { useState } from "react";

import { AddLiquidity, RemoveLiquidity } from "../components/Vaults"

import cn from 'classname'

type VAULTS_TAB_TYPE = "add" | "remove";

export default function Vaults({ library, state, dispatch }) {
  const [tab, setTab] = useState<VAULTS_TAB_TYPE>("add");

  return (
    <div className="vaults-container">
      <div className="vaults-title">
        <h1>vaults</h1>
      </div>
      <div className="vaults-tab-menu">
        <div
          className={cn("vaults-tab-menu-item", { active: tab === 'add'})}
          role="button"
          onClick={(e) => setTab("add")}
        >
          Add
        </div>
        <div
          className={cn("vaults-tab-menu-item", { active: tab === 'remove' })}
          role="button"
          onClick={(e) => setTab("remove")}
        >
          Remove
        </div>
      </div>
      <div className="vaults-tab-content">
        {tab === "add" && <AddLiquidity />}
        {tab === "remove" && <RemoveLiquidity />}
      </div>
    </div>
  );
}
