import React from "react";
import { moneyTips } from "../../data/semesterData";

export default function MoneyTip() {
  const tip = moneyTips[Math.floor(Math.random() * moneyTips.length)];
  return (
    <div className="money-tip-card">
      <span>💡</span>
      <p>{tip}</p>
    </div>
  );
}