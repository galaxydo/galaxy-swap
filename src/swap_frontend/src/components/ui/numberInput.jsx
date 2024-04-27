import React, { useState } from 'react';
import './NumberInput.css';

function NumberInput({ initial = 10, min = 1, max = 250, onChange }) {
  const [value, setValue] = useState(initial);

  const handleIncrement = () => {
    const newValue = Math.min(value + 1, max);
    setValue(newValue);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - 1, min);
    setValue(newValue);
    onChange(newValue);
  };

  const handleChange = (e) => {
    const intValue = parseInt(e.target.value, 10);
    if (!isNaN(intValue)) {
      setValue(intValue);
    } else {
      setValue('');
    }
  };

  const handleBlur = () => {
    if (value < min) {
      setValue(min);
      onChange(min);
    } else if (value > max) {
      setValue(max);
      onChange(max);
    } else {
      onChange(value);
    }
  };

  return (
    <div className='my-3 px-8'>
    <div className="flex items-center justify-center space-x-2 border-2 border-gray-800 rounded-full">
        <button 
            className="bg-gray-800 text-white px-7 py-2 rounded-l-full hover:bg-gray-900"        
            onClick={handleDecrement} disabled={value <= min}
        >
            -
        </button>
        <div className="relative flex-grow ">
            <input 
                type="number"
                className="w-full text-center px-2 py-1 focus:outline-none rounded"
                value={value} 
                onChange={handleChange} 
                onBlur={handleBlur} 
                style={{ paddingRight: '2rem' }}
            />
            <span className="absolute inset-y-0 right-0 px-1 flex items-center text-gray-700">
            ICP
            </span>
        </div>
        <button 
            className="bg-gray-800 text-white px-7 py-2 rounded-r-full hover:bg-gray-900"
            onClick={handleIncrement} 
            disabled={value >= max}
        >
            +
        </button>
    </div>
    </div>

  );
}

export default NumberInput;
