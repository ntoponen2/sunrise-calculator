// NumberInput.js
// This is a reusable React component for a controlled number input field.
// It handles formatting, validation, formulas, and navigation as per requirements.

import React, { useState } from 'react';
import { evaluate } from 'mathjs'; // Import evaluate from mathjs for safe formula parsing

const NumberInput = React.forwardRef(({
  min = '*', // Minimum value, '*' means no min
  max = '*', // Maximum value, '*' means no max
  step = '*', // Step for mouse input, '*' means no step (text input)
  dec = '*', // Decimals after dot, '*' means 2
  id, // Unique ID for the input
  onChange, // Optional callback for value change
  navigateToField // Function to handle arrow key navigation (passed from parent)
}, ref) => {
  const [value, setValue] = useState(''); // Current input value (formatted or raw)
  const [error, setError] = useState(false); // Flag for error state
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
    const minNum = min !== '*' ? parseFloat(min) : NaN;
    const maxNum = max !== '*' ? parseFloat(max) : NaN;
    setError((!isNaN(minNum) && num < minNum) || (!isNaN(maxNum) && num > maxNum));
  };

  // Handle key down: Filter allowed characters and handle arrows/TAB
  const handleKeyDown = (e) => {
    const allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', '=', '-', '+', '/', '*', '(', ')'];

    // Handle comma -> dot replacement
    if (e.key === ',') {
      e.preventDefault();
      setValue(value + '.');
      return;
    }

    // '=' only as first char
    if (e.key === '=' && e.target.selectionStart !== 0) {
      e.preventDefault();
      return;
    }

    if (['Tab', 'Enter'].includes(e.key)) {
      e.preventDefault();
      e.target.blur();
      return;
    }

    // Block non-allowed keys (except control keys like backspace, delete, arrows)
    if (!allowedChars.includes(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      return;
    }

    // Handle arrow keys for navigation only at edges for left/right
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      const { selectionStart } = e.target;
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
      // Else, allow default cursor movement
    }
  };

  // Handle input change: Enforce decimals limit
  const handleInput = (e) => {
    const rawValue = e.target.value;
    setValue(rawValue);
  };

  // On focus: Remove separators, select all
  const handleFocus = (e) => {
    const raw = removeThousandsSeparators(value);
    setValue(raw);
    e.target.setSelectionRange(0, 0);
  };

  // On blur: Format, evaluate, validate
  const handleBlur = () => {
    if (value === '') return;

    let processed = removeThousandsSeparators(value);
    setError(false);

    // Evaluate formula
    const evaluated = evaluateFormula(processed);
    if (processed.startsWith('=') && evaluated === null) {
      setError(true);
      setTimeout(() => ref.current.focus(), 0); // Queue focus to handle tab/blur properly
      return;
    }
    processed = evaluated;

    // Parse to number and validate min/max
    const num = parseFloat(processed);
    validateMinMax(num);

    // Format with separators and decimals
    const formatted = addThousandsSeparators(num.toFixed(decimals));
    setValue(formatted);
    if (onChange) onChange(formatted);
  };

  // Add below other handlers in NumberInput.js
  const handleWheel = (e) => {
    e.preventDefault(); // Prevent page scrolling when hovering input
    if (step === '*') return;
    const current = parseFloat(removeThousandsSeparators(value)) || 0;
    const stepValue = parseFloat(step);

    // deltaY > 0 means scrolling down (decrease value), < 0 means up (increase)
    const newValue = e.deltaY < 0 ? current + stepValue : current - stepValue;

    validateMinMax(newValue);

    // Format and update
    const formatted = addThousandsSeparators(newValue.toFixed(decimals));
    setValue(formatted);
    if (onChange) onChange(formatted);
  };

  const stepProp = step !== '*' ? { step: parseFloat(step) } : {};

  return (
    <input
      ref={ref}
      type={'text'}
      value={value}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onWheel={handleWheel}
      className={error ? 'error' : ''} // Apply error class if invalid
      {...stepProp} // Add step if applicable
    />
  );
});

export default NumberInput;