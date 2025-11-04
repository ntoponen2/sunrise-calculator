// NumberInput.js
// This is a reusable React component for a controlled number input field.
// It handles formatting, validation, formulas, and navigation as per requirements.

import React, { useState, useRef } from 'react';
import { evaluate } from 'mathjs'; // Import evaluate from mathjs for safe formula parsing

const NumberInput = ({
  min = '*', // Minimum value, '*' means no min
  max = '*', // Maximum value, '*' means no max
  step = '*', // Step for mouse input, '*' means no step (text input)
  dec = '*', // Decimals after dot, '*' means 2
  id, // Unique ID for the input
  onChange, // Optional callback for value change
  navigateToField // Function to handle arrow key navigation (passed from parent)
}) => {
  const [value, setValue] = useState(''); // Current input value (formatted or raw)
  const [error, setError] = useState(false); // Flag for error state
  const inputRef = useRef(null); // Ref to the input element for focus control
  const decimals = dec === '*' ? 2 : parseInt(dec, 10); // Resolve decimals

  // Helper to add thousands separators (e.g., 1200.55 -> 1 200.55)
  const addThousandsSeparators = (numStr) => {
    const parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
  };

  // Helper to remove thousands separators (e.g., 1 200.55 -> 1200.55)
  const removeThousandsSeparators = (numStr) => {
    return numStr.replace(/\s/g, '');
  };

  // Evaluate formula if starts with '=' using mathjs
  const evaluateFormula = (input) => {
    if (input.startsWith('=')) {
      try {
        // Remove '=' and evaluate safely with mathjs
        const result = evaluate(input.slice(1));
        return result.toFixed(decimals);
      } catch (e) {
        return null; // Invalid formula
      }
    }
    return input;
  };

  // Validate against min/max
  const validateMinMax = (num) => {
    return !(((min !== '*' && num < parseFloat(min)) || (max !== '*' && num > parseFloat(max))));
  };

  // Handle key down: Filter allowed characters and handle arrows/TAB
  const handleKeyDown = (e) => {
    const allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', '=', '-', '+', '/', '*', '(', ')'];
    const isFirstChar = value.length === 0;

    // Handle comma -> dot replacement
    if (e.key === ',') {
      e.preventDefault();
      setValue(value + '.');
      return;
    }

    // '=' only as first char
    if (e.key === '=' && !isFirstChar) {
      e.preventDefault();
      return;
    }

    // Block non-allowed keys (except control keys like backspace, delete, arrows)
    if (!allowedChars.includes(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.key) && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      return;
    }

    // Handle arrow keys for navigation
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      navigateToField(e.key, id); // Call parent navigation handler
    }
  };

  // Handle input change: Enforce decimals limit
  const handleInput = (e) => {
    const rawValue = e.target.value;
    const parts = rawValue.split('.');
    if (parts[1] && parts[1].length > decimals) {
      // Max decimals reached: Trigger blur
      inputRef.current.blur();
    }
    setValue(rawValue);
  };

  // On focus: Remove separators, select all
  const handleFocus = () => {
    const raw = removeThousandsSeparators(value);
    setValue(raw);
    inputRef.current.select();
  };

  // On blur: Format, evaluate, validate
  const handleBlur = () => {
    let processed = removeThousandsSeparators(value);
    setError(false);

    // Evaluate formula
    const evaluated = evaluateFormula(processed);
    if (processed.startsWith('=') && evaluated === null) {
      setError(true);
      inputRef.current.focus(); // Keep focus on error
      return;
    }
    processed = evaluated !== null ? evaluated : processed;

    // Parse to number and validate min/max
    const num = parseFloat(processed);
    if (isNaN(num) || !validateMinMax(num)) {
      setError(true);
      inputRef.current.focus(); // Keep focus on error
      return;
    }

    // Format with separators and decimals
    const formatted = addThousandsSeparators(num.toFixed(decimals));
    setValue(formatted);
    if (onChange) onChange(formatted);
  };

  // Input type: 'number' if step provided, else 'text'
  const inputType = step === '*' ? 'text' : 'number';
  const stepProp = step !== '*' ? { step: parseFloat(step) } : {};

  return (
    <input
      ref={inputRef}
      type={inputType}
      value={value}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={error ? 'error' : ''} // Apply error class if invalid
      {...stepProp} // Add step if applicable
    />
  );
};

export default NumberInput;