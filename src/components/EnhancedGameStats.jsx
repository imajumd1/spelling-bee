/**
 * Enhanced Game Stats Component
 * Displays comprehensive stats, streaks, and achievement progress
 */

import { useState, useEffect } from 'react';
import './EnhancedGameStats.css';

const EnhancedGameStats = ({ 
  score, 
  maxScore, 
  foundWords, 
  totalWords,
  userStats,
  currentStreak,
  achievementLevel,
  timeRemaining,
  onToggleStats
}) => {
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);

  // Calculate progress percentage
  const progressPercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  
  // Achievement levels configuration
  const getAchievementLevel = (percentage) => {
    if (percentage >= 80) return { level: 'Genius', emoji: '🏆', color: '#ff6b35', tier: 8 };
    if (percentage >= 70) return { level: 'Amazing', emoji: '🌟', color: '#4ecdc4', tier: 7 };
    if (percentage >= 60) return { level: 'Great', emoji: '🎉', color: '#45b7d1', tier: 6 };
    if (percentage >= 50) return { level: 'Nice', emoji: '👍', color: '#96ceb4', tier: 5 };
    if (percentage >= 40) return { level: 'Solid', emoji: '💪', color: '#feca57', tier: 4 };
    if (percentage >= 30) return { level: 'Good', emoji: '😊', color: '#ff9ff3', tier: 3 };
    if (percentage >= 20) return { level: 'Moving Up', emoji: '⬆️', color: '#54a0ff', tier: 2 };
    if (percentage >= 10) return { level: 'Good Start', emoji: '🌱', color: '#5f27cd', tier: 1 };
    return { level: 'Beginner', emoji: '🐣', color: '#c8d6e5', tier: 0 };
  };

  const achievement = getAchievementLevel(progressPercentage);
  const nextTier = getAchievementLevel(Math.min(100, (achievement.tier + 1) * 10));
  
  // Calculate points to next level
  const pointsToNext = achievement.tier < 8 ? 
    Math.ceil(maxScore * (nextTier.tier * 10) / 100) - score : 0;

  // Format time remaining until next puzzle
  const formatTimeRemaining = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) return 'Now available!';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Animate progress bar on score changes
  useEffect(() => {
    setAnimateProgress(true);
    const timer = setTimeout(() => setAnimateProgress(false), 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="enhanced-game-stats">
      <div className="stats-header">
        <div className="score-section">
          <div className="current-score">
            <span className="score-value">{score}</span>
            <span className="score-label">Points</span>
          </div>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className={`progress-fill ${animateProgress ? 'animate' : ''}`}
                style={{ 
                  width: `${Math.min(progressPercentage, 100)}%`,
                  backgroundColor: achievement.color 
                }}
              />
              <div className="genius-marker" style={{ left: '80%' }}>
                <span className="genius-label">Genius</span>
              </div>
              {/* Progress markers for each level */}
              {[10, 20, 30, 40, 50, 60, 70].map(percent => (
                <div 
                  key={percent}
                  className={`progress-marker ${progressPercentage >= percent ? 'reached' : ''}`}
                  style={{ left: `${percent}%` }}
                />
              ))}
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
          
          {pointsToNext > 0 && (
            <div className="next-level-info">
              <span className="points-to-next">{pointsToNext} to {nextTier.level}</span>
            </div>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card words">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">
              <span className="found-count">{foundWords}</span>
              <span className="total-count">/{totalWords}</span>
            </div>
            <div className="stat-label">Words Found</div>
            <div className="stat-percentage">
              {totalWords > 0 ? Math.round((foundWords / totalWords) * 100) : 0}% discovered
            </div>
          </div>
        </div>

        <div className="stat-card streak">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{currentStreak || 0}</div>
            <div className="stat-label">Current Streak</div>
            <div className="stat-percentage">
              {userStats?.longestStreak ? `Best: ${userStats.longestStreak}` : 'Keep going!'}
            </div>
          </div>
        </div>

        <div className="stat-card games">
          <div className="stat-icon">🎮</div>
          <div className="stat-content">
            <div className="stat-value">{userStats?.totalGamesPlayed || 0}</div>
            <div className="stat-label">Games Played</div>
            <div className="stat-percentage">
              {userStats?.geniusCount || 0} genius{(userStats?.geniusCount || 0) !== 1 ? 'es' : ''}
            </div>
          </div>
        </div>

        <div className="stat-card next-puzzle">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <div className="stat-value time-remaining">
              {formatTimeRemaining(timeRemaining)}
            </div>
            <div className="stat-label">Next Puzzle</div>
            <div className="stat-percentage">10:00 AM PST</div>
          </div>
        </div>
      </div>

      {userStats && (
        <div className="stats-toggle">
          <button 
            className="toggle-detailed-stats"
            onClick={() => setShowDetailedStats(!showDetailedStats)}
          >
            {showDetailedStats ? 'Hide' : 'Show'} Detailed Stats
          </button>
        </div>
      )}

      {showDetailedStats && userStats && (
        <div className="detailed-stats">
          <h4>Overall Statistics</h4>
          <div className="detailed-grid">
            <div className="detailed-stat">
              <span className="detail-label">Average Score</span>
              <span className="detail-value">{userStats.averageScore}</span>
            </div>
            <div className="detailed-stat">
              <span className="detail-label">Total Words</span>
              <span className="detail-value">{userStats.totalWords}</span>
            </div>
            <div className="detailed-stat">
              <span className="detail-label">Pangrams Found</span>
              <span className="detail-value">{userStats.totalPangrams}</span>
            </div>
            <div className="detailed-stat">
              <span className="detail-label">Genius Rate</span>
              <span className="detail-value">{userStats.geniusRate}%</span>
            </div>
            <div className="detailed-stat">
              <span className="detail-label">Average Words</span>
              <span className="detail-value">{userStats.averageWords}</span>
            </div>
            <div className="detailed-stat">
              <span className="detail-label">Days Played</span>
              <span className="detail-value">{userStats.gamesPlayed}</span>
            </div>
          </div>

          {userStats.lastPlayed && (
            <div className="last-played">
              <span className="detail-label">Last Played:</span>
              <span className="detail-value">
                {new Date(userStats.lastPlayed).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedGameStats;