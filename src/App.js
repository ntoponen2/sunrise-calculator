// App.js
// This is the main entry point of the React app.
// It renders a single NumberInput component with customizable props (min, max, step, dec) via text inputs.

import React, { useState, useRef } from 'react';
import NumberInput from './NumberInput';
import './App.css'; // Import styles

function App() {
  const [min, setMin] = useState('*'); // State for min prop
  const [max, setMax] = useState('*'); // State for max prop
  const [step, setStep] = useState('*'); // State for step prop
  const [dec, setDec] = useState('*'); // State for dec prop

  // Refs for all inputs
  const mainRef = useRef(null);
  const minRef = useRef(null);
  const maxRef = useRef(null);
  const stepRef = useRef(null);
  const decRef = useRef(null);

  // Map IDs to refs
  const fields = {
    mainInput: mainRef,
    minInput: minRef,
    maxInput: maxRef,
    stepInput: stepRef,
    decInput: decRef
  };

  // Ordered fields for navigation
  const fieldOrder = ['mainInput', 'minInput', 'maxInput', 'stepInput', 'decInput'];

  // Navigation handler
  const navigateToField = (direction, currentId) => {
    const currentIndex = fieldOrder.indexOf(currentId);
    let nextIndex;
    if (direction === 'prev') {
      nextIndex = (currentIndex - 1 + fieldOrder.length) % fieldOrder.length;
    } else if (direction === 'next') {
      nextIndex = (currentIndex + 1) % fieldOrder.length;
    }
    const nextField = fields[fieldOrder[nextIndex]];
    if (nextField.current) {
      nextField.current.focus();
    }
  };

  // Keydown handler for custom text inputs (similar to NumberInput for arrows)
  const handleCustomKeyDown = (e, id) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      const { selectionStart, value } = e.target;
      let navigate = false;
      let navDirection = '';
      if (e.key === 'ArrowUp') {
        navigate = true;
        navDirection = 'prev';
      } else if (e.key === 'ArrowDown') {
        navigate = true;
        navDirection = 'next';
      } else if (e.key === 'ArrowLeft' && selectionStart === 0) {
        navigate = true;
        navDirection = 'prev';
      } else if (e.key === 'ArrowRight' && selectionStart === value.length) {
        navigate = true;
        navDirection = 'next';
      }
      if (navigate) {
        e.preventDefault();
        navigateToField(navDirection, id);
      }
    }
  };

  return (
    <div className="App">
      <h1>Калькулятор "ЗАРЯ"</h1>
      <form>
        <label>Ввод:</label>
        <NumberInput
          id="mainInput"
          min={min}
          max={max}
          step={step}
          dec={dec}
          navigateToField={navigateToField}
          ref={mainRef}
        />
        <br />

        <label>Min (* для отключения):</label>
        <input
          ref={minRef}
          type="text"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          onKeyDown={(e) => handleCustomKeyDown(e, 'minInput')}
        />
        <br />

        <label>Max (* для отключения):</label>
        <input
          ref={maxRef}
          type="text"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          onKeyDown={(e) => handleCustomKeyDown(e, 'maxInput')}
        />
        <br />

        <label>Step (* для отключения):</label>
        <input
          ref={stepRef}
          type="text"
          value={step}
          onChange={(e) => setStep(e.target.value)}
          onKeyDown={(e) => handleCustomKeyDown(e, 'stepInput')}
        />
        <br />

        <label>Dec (* для 2 знаков после запятой):</label>
        <input
          ref={decRef}
          type="text"
          value={dec}
          onChange={(e) => setDec(e.target.value)}
          onKeyDown={(e) => handleCustomKeyDown(e, 'decInput')}
        />
      </form>
    </div>
  );
}

export default App;