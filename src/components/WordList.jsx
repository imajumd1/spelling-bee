/**
 * WordList Component
 * Displays found words and optional hints
 */

import { useState } from 'react';
import './WordList.css';

const WordList = ({ foundWords, allValidWords, showHints = false }) => {
  const [showAllWords, setShowAllWords] = useState(false);
  const [sortBy, setSortBy] = useState('alphabetical'); // 'alphabetical' or 'length'

  // Sort found words
  const getSortedWords = (words) => {
    const sorted = [...words];
    if (sortBy === 'length') {
      return sorted.sort((a, b) => {
        if (a.length !== b.length) {
          return b.length - a.length; // Longer words first
        }
        return a.localeCompare(b); // Then alphabetical
      });
    }
    return sorted.sort(); // Alphabetical
  };

  // Group words by length for better display
  const groupWordsByLength = (words) => {
    const groups = {};
    words.forEach(word => {
      const length = word.length;
      if (!groups[length]) {
        groups[length] = [];
      }
      groups[length].push(word);
    });
    return groups;
  };

  // Check if word is a pangram (uses all 7 letters)
  const isPangram = (word) => {
    const uniqueLetters = new Set(word.split(''));
    return uniqueLetters.size === 7;
  };

  // Calculate word score
  const getWordScore = (word) => {
    let score = word.length === 4 ? 1 : word.length;
    if (isPangram(word)) {
      score += 7;
    }
    return score;
  };

  const sortedFoundWords = getSortedWords(foundWords);
  const wordGroups = groupWordsByLength(sortedFoundWords);
  
  // Calculate stats
  const totalScore = foundWords.reduce((sum, word) => sum + getWordScore(word), 0);
  const pangramCount = foundWords.filter(isPangram).length;

  return (
    <div className="word-list">
      <div className="word-list-header">
        <h3>Your Words</h3>
        
        <div className="word-list-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="alphabetical">A-Z</option>
            <option value="length">By Length</option>
          </select>
          
          {showHints && (
            <button
              onClick={() => setShowAllWords(!showAllWords)}
              className="hint-toggle"
            >
              {showAllWords ? 'Hide Hints' : 'Show Hints'}
            </button>
          )}
        </div>
      </div>

      <div className="word-list-stats">
        <div className="stat">
          <span className="stat-value">{foundWords.length}</span>
          <span className="stat-label">words</span>
        </div>
        <div className="stat">
          <span className="stat-value">{totalScore}</span>
          <span className="stat-label">points</span>
        </div>
        {pangramCount > 0 && (
          <div className="stat pangram-stat">
            <span className="stat-value">{pangramCount}</span>
            <span className="stat-label">pangram{pangramCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="words-container">
        {foundWords.length === 0 ? (
          <div className="no-words">
            No words found yet. Start typing!
          </div>
        ) : (
          <div className="found-words">
            {sortBy === 'length' ? (
              // Group by length display
              Object.entries(wordGroups)
                .sort(([a], [b]) => parseInt(b) - parseInt(a))
                .map(([length, words]) => (
                  <div key={length} className="word-group">
                    <div className="word-group-header">
                      {length} letters ({words.length})
                    </div>
                    <div className="word-group-words">
                      {words.map((word, index) => (
                        <div 
                          key={index} 
                          className={`word-item ${isPangram(word) ? 'pangram' : ''}`}
                        >
                          <span className="word-text">{word.toUpperCase()}</span>
                          <span className="word-score">+{getWordScore(word)}</span>
                          {isPangram(word) && <span className="pangram-badge">PANGRAM</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            ) : (
              // Simple alphabetical list
              <div className="word-list-simple">
                {sortedFoundWords.map((word, index) => (
                  <div 
                    key={index} 
                    className={`word-item ${isPangram(word) ? 'pangram' : ''}`}
                  >
                    <span className="word-text">{word.toUpperCase()}</span>
                    <span className="word-score">+{getWordScore(word)}</span>
                    {isPangram(word) && <span className="pangram-badge">PANGRAM</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hints section (if enabled) */}
        {showHints && showAllWords && (
          <div className="hints-section">
            <h4>All Possible Words ({allValidWords.length})</h4>
            <div className="hint-words">
              {allValidWords.map((word, index) => (
                <div 
                  key={index} 
                  className={`hint-word ${foundWords.includes(word) ? 'found' : 'not-found'}`}
                >
                  {foundWords.includes(word) ? word.toUpperCase() : '???'}
                  {isPangram(word) && <span className="pangram-badge">P</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordList;