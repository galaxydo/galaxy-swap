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
  // className="text-white bg-indigo-500 hover:bg-indigo-600 w-full py-2 rounded"

  return (
    <div className='px-8 text-lg'>
      <div className="flex items-center justify-center">
          <button 
              className="text-white bg-indigo-500 hover:bg-indigo-600 px-7 py-2 rounded-l-full"
              onClick={handleDecrement} disabled={value <= min}
          >
              -
          </button>
          <div className="relative flex-grow ">
              <input 
                  type="number"
                  className="w-full text-center text-white px-6 py-2 focus:outline-none bg-indigo-500"
                  value={value} 
                  onChange={handleChange} 
                  onBlur={handleBlur} 
                  style={{ paddingRight: '2rem' }}
              />
              <span className="absolute inset-y-0 right-0 px-3 flex text-white items-center">
              ICP
              </span>
          </div>
          <button 
              className="text-white bg-indigo-500 hover:bg-indigo-600 px-7 py-2 rounded-r-full"
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
