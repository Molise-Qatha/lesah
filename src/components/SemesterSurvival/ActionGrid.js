import React, { useState } from "react";
import ActionCard from "./ActionCard";
import { actions } from "../../data/semesterData";

export default function ActionGrid() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (id) => {
    if (selected === id) {
      setSelected(null); // deselect
    } else {
      setSelected(id);
    }
  };

  return (
    <div className="actions-section">
      <h3>📋 Today's Action</h3>
      <div className="action-grid">
        {actions.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            selected={selected}
            onClick={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}