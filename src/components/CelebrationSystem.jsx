/**
 * CelebrationSystem Component
 * Handles celebrations, animations, and feedback for user achievements
 */

import { useState, useEffect } from 'react';
import './CelebrationSystem.css';

const CelebrationSystem = ({ 
  celebrations, 
  onCelebrationComplete,
  celebrationsEnabled = true 
}) => {
  const [activeCelebrations, setActiveCelebrations] = useState([]);

  useEffect(() => {
    if (!celebrationsEnabled || !celebrations.length) return;

    // Add new celebrations to active list
    celebrations.forEach(celebration => {
      if (!activeCelebrations.find(c => c.id === celebration.id)) {
        setActiveCelebrations(prev => [...prev, {
          ...celebration,
          startTime: Date.now()
        }]);

        // Auto-remove after duration
        setTimeout(() => {
          setActiveCelebrations(prev => 
            prev.filter(c => c.id !== celebration.id)
          );
          onCelebrationComplete?.(celebration);
        }, celebration.duration || 3000);
      }
    });
  }, [celebrations, celebrationsEnabled, onCelebrationComplete]);

  const renderCelebration = (celebration) => {
    const { type, message, score, isSpecial } = celebration;

    switch (type) {
      case 'word_found':
        return (
          <div className={`celebration word-celebration ${isSpecial ? 'special' : ''}`}>
            <div className="celebration-icon">✅</div>
            <div className="celebration-message">{message}</div>
            {score && <div className="celebration-score">+{score}</div>}
          </div>
        );

      case 'pangram':
        return (
          <div className="celebration pangram-celebration">
            <div className="celebration-icon">🌟</div>
            <div className="celebration-message">{message}</div>
            <div className="celebration-subtitle">PANGRAM!</div>
            {score && <div className="celebration-score">+{score}</div>}
            <div className="celebration-sparkles">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`sparkle sparkle-${i}`}>✨</div>
              ))}
            </div>
          </div>
        );

      case 'level_up':
        return (
          <div className="celebration level-celebration">
            <div className="celebration-icon">🎉</div>
            <div className="celebration-message">{message}</div>
            <div className="celebration-subtitle">Level Up!</div>
            <div className="celebration-confetti">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`confetti confetti-${i}`}></div>
              ))}
            </div>
          </div>
        );

      case 'genius':
        return (
          <div className="celebration genius-celebration">
            <div className="celebration-icon">🏆</div>
            <div className="celebration-message">{message}</div>
            <div className="celebration-subtitle">GENIUS ACHIEVED!</div>
            <div className="celebration-fireworks">
              {[...Array(16)].map((_, i) => (
                <div key={i} className={`firework firework-${i}`}>🎆</div>
              ))}
            </div>
          </div>
        );

      case 'streak':
        return (
          <div className="celebration streak-celebration">
            <div className="celebration-icon">🔥</div>
            <div className="celebration-message">{message}</div>
            <div className="celebration-subtitle">On Fire!</div>
          </div>
        );

      case 'first_word':
        return (
          <div className="celebration first-word-celebration">
            <div className="celebration-icon">🌱</div>
            <div className="celebration-message">{message}</div>
            <div className="celebration-subtitle">Great start!</div>
          </div>
        );

      case 'milestone':
        return (
          <div className="celebration milestone-celebration">
            <div className="celebration-icon">⭐</div>
            <div className="celebration-message">{message}</div>
            <div className="celebration-subtitle">Milestone reached!</div>
          </div>
        );

      default:
        return (
          <div className="celebration default-celebration">
            <div className="celebration-icon">🎉</div>
            <div className="celebration-message">{message}</div>
          </div>
        );
    }
  };

  if (!celebrationsEnabled || !activeCelebrations.length) {
    return null;
  }

  return (
    <div className="celebration-container">
      {activeCelebrations.map(celebration => (
        <div 
          key={celebration.id} 
          className="celebration-wrapper"
          style={{
            animationDelay: `${(Date.now() - celebration.startTime)}ms`
          }}
        >
          {renderCelebration(celebration)}
        </div>
      ))}
    </div>
  );
};

export default CelebrationSystem;