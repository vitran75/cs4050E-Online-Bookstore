import React from "react";

const Selector = ({ options, selectedValue, onChange, name, required = false }) => {
  return (
    <select
      name={name}
      value={selectedValue}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="selector-dropdown"
    >
      <option value="" disabled>
        Select...
      </option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};

export default Selector;
