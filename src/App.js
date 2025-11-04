// App.js
// This is the main entry point of the React app.
// It renders a single NumberInput component with customizable props (min, max, step, dec) via text inputs.

import React, { useState } from 'react';
import NumberInput from './NumberInput';
import './App.css'; // Import styles

function App() {
  const [min, setMin] = useState('*'); // State for min prop
  const [max, setMax] = useState('*'); // State for max prop
  const [step, setStep] = useState('*'); // State for step prop
  const [dec, setDec] = useState('*'); // State for dec prop

  // Dummy navigation handler since there's only one field (prevents errors on arrow keys)
  const navigateToField = () => {};

  return (
    <div className="App">
      <h1>Customizable Number Input Demo</h1>
      <form>
        <label>Main Number Field:</label>
        <NumberInput
          id="mainInput"
          min={min}
          max={max}
          step={step}
          dec={dec}
          navigateToField={navigateToField}
        />
        <br />

        <label>Min (* for none):</label>
        <input
          type="text"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
        <br />

        <label>Max (* for none):</label>
        <input
          type="text"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
        <br />

        <label>Step (* for none):</label>
        <input
          type="text"
          value={step}
          onChange={(e) => setStep(e.target.value)}
        />
        <br />

        <label>Dec (* for 2):</label>
        <input
          type="text"
          value={dec}
          onChange={(e) => setDec(e.target.value)}
        />
      </form>
      <p>Enter values in the customization fields to update the main input's behavior. Try numbers, formulas like =5+2.</p>
    </div>
  );
}

export default App;