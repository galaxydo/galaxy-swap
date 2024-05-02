// src/components/ui/numberInput.jsx
import React, { useState } from "react";
import "./NumberInput.css";

function NumberInput({
  initial = 10,
  min = 10,
  max = 250,
  onChange,
  disabled = false,
}) {
  const [value, setValue] = useState(initial);

  const handleIncrement = () => {
    if (!disabled) {
      const newValue = Math.min(value + 1, max);
      setValue(newValue);
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (!disabled) {
      const newValue = Math.max(value - 1, min);
      setValue(newValue);
      onChange(newValue);
    }
  };

  const handleChange = (e) => {
    if (!disabled) {
      const intValue = parseInt(e.target.value, 10);
      if (!isNaN(intValue)) {
        setValue(intValue);
      } else {
        setValue("");
      }
    }
  };

  const handleBlur = () => {
    if (!disabled) {
      if (value < min) {
        setValue(min);
        onChange(min);
      } else if (value > max) {
        setValue(max);
        onChange(max);
      } else {
        onChange(value);
      }
    }
  };

  return (
    <div className="px-8 text-lg">
      <div className="flex items-center justify-center">
        <button
          className=" bg-indigo-500 hover:bg-indigo-600 px-7 py-2 rounded-l-full"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
        >
          -
        </button>
        <div className="relative flex-grow ">
          <input
            type="number"
            className="w-full text-center  px-6 py-2 focus:outline-none bg-indigo-500"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            style={{ paddingRight: "2rem" }}
          />
          <span className="absolute inset-y-0 right-0 px-3 flex  items-center">
            ICP
          </span>
        </div>
        <button
          className=" bg-indigo-500 hover:bg-indigo-600 px-7 py-2 rounded-r-full"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default NumberInput;
