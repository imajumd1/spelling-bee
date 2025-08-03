/**
 * GameStats Component
 * Displays score, progress, and achievement level
 */

import './GameStats.css';

const GameStats = ({ score, maxScore, foundWords, totalWords }) => {
  // Calculate progress percentage
  const progressPercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  
  // Achievement levels based on percentage
  const getAchievementLevel = (percentage) => {
    if (percentage >= 80) return { level: 'Genius', emoji: '🏆', color: '#ff6b35' };
    if (percentage >= 70) return { level: 'Amazing', emoji: '🌟', color: '#4ecdc4' };
    if (percentage >= 60) return { level: 'Great', emoji: '🎉', color: '#45b7d1' };
    if (percentage >= 50) return { level: 'Nice', emoji: '👍', color: '#96ceb4' };
    if (percentage >= 40) return { level: 'Solid', emoji: '💪', color: '#feca57' };
    if (percentage >= 30) return { level: 'Good', emoji: '😊', color: '#ff9ff3' };
    if (percentage >= 20) return { level: 'Moving Up', emoji: '⬆️', color: '#54a0ff' };
    if (percentage >= 10) return { level: 'Good Start', emoji: '🌱', color: '#5f27cd' };
    return { level: 'Beginner', emoji: '🐣', color: '#c8d6e5' };
  };

  const achievement = getAchievementLevel(progressPercentage);
  
  // Calculate words remaining to Genius level (80%)
  const geniusTarget = Math.ceil(maxScore * 0.8);
  const pointsToGenius = Math.max(0, geniusTarget - score);

  return (
    <div className="game-stats">
      <div className="score-section">
        <div className="current-score">
          <span className="score-value">{score}</span>
          <span className="score-label">Points</span>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${Math.min(progressPercentage, 100)}%`,
                backgroundColor: achievement.color 
              }}
            />
            <div className="genius-marker" style={{ left: '80%' }}>
              <span className="genius-label">Genius</span>
            </div>
          </div>
          <div className="progress-text">
            {progressPercentage}% of {maxScore} points
          </div>
        </div>
      </div>

      <div className="achievement-section">
        <div className="current-level" style={{ color: achievement.color }}>
          <span className="level-emoji">{achievement.emoji}</span>
          <span className="level-name">{achievement.level}</span>
        </div>
        
        {pointsToGenius > 0 && (
          <div className="genius-target">
            {pointsToGenius} points to Genius!
          </div>
        )}
      </div>

      <div className="word-stats">
        <div className="word-count">
          <span className="found-count">{foundWords}</span>
          <span className="total-count">/{totalWords}</span>
          <span className="word-label">words</span>
        </div>
        
        <div className="word-percentage">
          {totalWords > 0 ? Math.round((foundWords / totalWords) * 100) : 0}% found
        </div>
      </div>
    </div>
  );
};

export default GameStats;