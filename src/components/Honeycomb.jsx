/**
 * Honeycomb Component
 * Interactive letter arrangement for Spelling Bee
 */

import { useState } from 'react';
import './Honeycomb.css';

const Honeycomb = ({ letters, centerLetter, onLetterClick, selectedLetters = [] }) => {
  const [clickedLetter, setClickedLetter] = useState(null);

  const handleLetterClick = (letter, isCenter = false) => {
    // Visual feedback
    setClickedLetter(letter);
    setTimeout(() => setClickedLetter(null), 150);
    
    // Notify parent component
    onLetterClick(letter, isCenter);
  };

  const getLetterClass = (letter) => {
    let classes = 'honeycomb-letter';
    if (letter === centerLetter) {
      classes += ' center-letter';
    }
    if (clickedLetter === letter) {
      classes += ' clicked';
    }
    return classes;
  };

  // Arrange letters: center + 6 surrounding
  const outerLetters = letters.filter(letter => letter !== centerLetter);

  return (
    <div className="honeycomb-container">
      <div className="honeycomb">
        {/* Top row - 2 letters */}
        <div className="honeycomb-row top">
          <button
            className={getLetterClass(outerLetters[0])}
            onClick={() => handleLetterClick(outerLetters[0])}
          >
            {outerLetters[0]?.toUpperCase()}
          </button>
          <button
            className={getLetterClass(outerLetters[1])}
            onClick={() => handleLetterClick(outerLetters[1])}
          >
            {outerLetters[1]?.toUpperCase()}
          </button>
        </div>

        {/* Middle row - 3 letters (left, center, right) */}
        <div className="honeycomb-row middle">
          <button
            className={getLetterClass(outerLetters[2])}
            onClick={() => handleLetterClick(outerLetters[2])}
          >
            {outerLetters[2]?.toUpperCase()}
          </button>
          <button
            className={getLetterClass(centerLetter)}
            onClick={() => handleLetterClick(centerLetter, true)}
          >
            {centerLetter?.toUpperCase()}
          </button>
          <button
            className={getLetterClass(outerLetters[3])}
            onClick={() => handleLetterClick(outerLetters[3])}
          >
            {outerLetters[3]?.toUpperCase()}
          </button>
        </div>

        {/* Bottom row - 2 letters */}
        <div className="honeycomb-row bottom">
          <button
            className={getLetterClass(outerLetters[4])}
            onClick={() => handleLetterClick(outerLetters[4])}
          >
            {outerLetters[4]?.toUpperCase()}
          </button>
          <button
            className={getLetterClass(outerLetters[5])}
            onClick={() => handleLetterClick(outerLetters[5])}
          >
            {outerLetters[5]?.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Honeycomb;