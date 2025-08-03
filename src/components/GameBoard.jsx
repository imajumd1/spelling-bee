/**
 * GameBoard Component
 * Main game interface for Spelling Bee with enhanced features
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import Honeycomb from './Honeycomb';
import WordList from './WordList';
import EnhancedGameStats from './EnhancedGameStats';
import CelebrationSystem from './CelebrationSystem';
import wordDictionary from '../services/wordDictionary';
import userProfile from '../services/userProfile';
import dailyPuzzle from '../services/dailyPuzzle';
import { useInstantValidation, useOptimizedAnimation, useKeyboardOptimization, usePerformanceMonitor } from '../hooks/usePerformance';
import './GameBoard.css';

const GameBoard = () => {
  // Game state
  const [letters, setLetters] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  const [centerLetter, setCenterLetter] = useState('D');
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState([]);
  const [allValidWords, setAllValidWords] = useState([]);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Enhanced features
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [celebrations, setCelebrations] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [timeToNextPuzzle, setTimeToNextPuzzle] = useState(0);
  const [lastFoundWordsCount, setLastFoundWordsCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  
  // Refs for performance
  const celebrationIdRef = useRef(0);
  const wordInputRef = useRef(null);
  
  // Performance hooks
  const { validateWord, validationState, clearValidation } = useInstantValidation(wordDictionary);
  const { triggerAnimation } = useOptimizedAnimation();
  usePerformanceMonitor('GameBoard');

  // Initialize game
  useEffect(() => {
    const initGame = async () => {
      setIsLoading(true);
      
      // Load dictionary and get today's puzzle
      await wordDictionary.loadDictionary();
      await loadTodaysPuzzle();
      
      // Load user stats
      const stats = userProfile.getStatsSummary();
      setUserStats(stats);
      setCurrentStreak(userProfile.profile.currentStreak);
      
      // Set up timer for next puzzle
      updateNextPuzzleTimer();
      
      setIsLoading(false);
    };
    
    initGame();
    
    // Update timer every minute
    const timerInterval = setInterval(updateNextPuzzleTimer, 60000);
    return () => clearInterval(timerInterval);
  }, []);

  // Load today's puzzle
  const loadTodaysPuzzle = async () => {
    try {
      const puzzle = await dailyPuzzle.getTodaysPuzzle();
      setCurrentPuzzle(puzzle);
      
      setLetters(puzzle.letters);
      setCenterLetter(puzzle.centerLetter);
      setAllValidWords(puzzle.validWords);
      setMaxScore(puzzle.maxScore);
      
      // Check if user has already played today's puzzle
      const todaysSession = userProfile.getTodaysSession(puzzle.puzzleId);
      if (todaysSession) {
        // Restore progress
        setFoundWords(todaysSession.foundWords);
        setScore(todaysSession.score);
        setMessage('Welcome back! Continue where you left off.');
        
        // Add celebration for returning
        addCelebration({
          type: 'milestone',
          message: 'Welcome back to today\'s puzzle!',
          duration: 2000
        });
      } else {
        // Fresh start
        setFoundWords([]);
        setScore(0);
        setMessage('Find words using these letters!');
        setGameStartTime(Date.now());
        
        // Add welcome celebration
        addCelebration({
          type: 'first_word',
          message: 'New puzzle ready!',
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error loading puzzle:', error);
      setMessage('Error loading puzzle. Please try again.');
    }
  };
  
  // Update timer for next puzzle
  const updateNextPuzzleTimer = () => {
    const timeRemaining = dailyPuzzle.getTimeUntilNextPuzzle();
    setTimeToNextPuzzle(timeRemaining);
  };

  // Calculate maximum possible score
  const calculateMaxScore = (words, allLetters) => {
    return words.reduce((total, word) => {
      let wordScore = word.length === 4 ? 1 : word.length;
      
      // Pangram bonus (uses all 7 letters)
      const uniqueLetters = new Set(word.split(''));
      if (uniqueLetters.size === 7) {
        wordScore += 7;
      }
      
      return total + wordScore;
    }, 0);
  };

  // Add celebration helper
  const addCelebration = useCallback((celebrationData) => {
    const id = ++celebrationIdRef.current;
    const celebration = {
      id,
      ...celebrationData,
      timestamp: Date.now()
    };
    
    setCelebrations(prev => [...prev, celebration]);
    
    // Auto-remove after duration
    setTimeout(() => {
      setCelebrations(prev => prev.filter(c => c.id !== id));
    }, celebrationData.duration || 3000);
  }, []);
  
  // Handle letter clicks with instant feedback
  const handleLetterClick = useCallback((letter) => {
    const newWord = currentWord + letter;
    setCurrentWord(newWord);
    clearValidation();
    
    // Trigger letter animation
    if (wordInputRef.current) {
      triggerAnimation(wordInputRef.current, 'letter-added', 200);
    }
    
    // Instant validation feedback
    setTimeout(() => {
      validateWord(newWord, letters, centerLetter);
    }, 100);
  }, [currentWord, letters, centerLetter, validateWord, clearValidation, triggerAnimation]);

  // Shuffle letters (keep center letter in place, shuffle outer letters)
  const handleShuffle = useCallback(() => {
    const outerLetters = letters.filter(letter => letter !== centerLetter);
    const shuffledOuter = [...outerLetters].sort(() => Math.random() - 0.5);
    
    // Reconstruct letters array with center letter in same position
    const newLetters = [];
    let outerIndex = 0;
    
    letters.forEach(letter => {
      if (letter === centerLetter) {
        newLetters.push(centerLetter);
      } else {
        newLetters.push(shuffledOuter[outerIndex]);
        outerIndex++;
      }
    });
    
    setLetters(newLetters);
    
    // Add shuffle celebration
    addCelebration({
      type: 'milestone',
      message: 'Letters shuffled!',
      duration: 1500
    });
    
    setMessage('Letters shuffled! Look for new patterns.');
  }, [letters, centerLetter, addCelebration]);

  // Delete last letter
  const handleDelete = () => {
    setCurrentWord(prev => prev.slice(0, -1));
  };

  // Clear current word
  const handleClear = () => {
    setCurrentWord('');
    setMessage('');
  };

  // Submit current word with enhanced feedback
  const handleSubmit = useCallback(() => {
    const word = currentWord.toLowerCase();
    
    // Quick validation
    if (word.length < 4) {
      setMessage('Words must be at least 4 letters long!');
      return;
    }
    
    if (!word.includes(centerLetter.toLowerCase())) {
      setMessage(`Word must contain the center letter "${centerLetter}"!`);
      return;
    }
    
    if (foundWords.includes(word)) {
      setMessage('Already found!');
      return;
    }
    
    if (!wordDictionary.isValidWord(word)) {
      setMessage('Not in word list!');
      return;
    }
    
    // Check if word can be formed from available letters
    const canForm = wordDictionary.canFormWord(word, letters, centerLetter.toLowerCase());
    if (!canForm) {
      setMessage('Cannot form this word with available letters!');
      return;
    }
    
    // Valid word found!
    const newFoundWords = [...foundWords, word];
    setFoundWords(newFoundWords);
    
    // Calculate score
    let wordScore = word.length === 4 ? 1 : word.length;
    const uniqueLetters = new Set(word.split(''));
    const isPangram = uniqueLetters.size === 7;
    
    if (isPangram) {
      wordScore += 7;
    }
    
    const newScore = score + wordScore;
    setScore(newScore);
    
    // Check for level progression
    const oldPercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const newPercentage = maxScore > 0 ? Math.round((newScore / maxScore) * 100) : 0;
    const levelChanged = Math.floor(oldPercentage / 10) !== Math.floor(newPercentage / 10);
    
    // Add appropriate celebration
    if (isPangram) {
      addCelebration({
        type: 'pangram',
        message: word.toUpperCase(),
        score: wordScore,
        duration: 4000
      });
      setMessage(`🌟 PANGRAM! +${wordScore} points!`);
    } else if (levelChanged && newPercentage >= 80) {
      addCelebration({
        type: 'genius',
        message: 'GENIUS ACHIEVED!',
        score: wordScore,
        duration: 5000
      });
      setMessage(`🏆 GENIUS! +${wordScore} points!`);
    } else if (levelChanged) {
      const levelNames = ['Beginner', 'Good Start', 'Moving Up', 'Good', 'Solid', 'Nice', 'Great', 'Amazing', 'Genius'];
      const newLevel = Math.min(Math.floor(newPercentage / 10), 8);
      addCelebration({
        type: 'level_up',
        message: `${levelNames[newLevel]} Level!`,
        score: wordScore,
        duration: 3000
      });
      setMessage(`🎉 Level up! +${wordScore} points!`);
    } else if (newFoundWords.length === 1) {
      addCelebration({
        type: 'first_word',
        message: 'Great start!',
        score: wordScore,
        duration: 2000
      });
      setMessage(`✅ First word! +${wordScore} points`);
    } else {
      addCelebration({
        type: 'word_found',
        message: word.toUpperCase(),
        score: wordScore,
        isSpecial: wordScore > 5,
        duration: 2000
      });
      setMessage(`✅ Good! +${wordScore} points`);
    }
    
    setCurrentWord('');
    clearValidation();
    
    // Save progress
    saveGameProgress(newFoundWords, newScore, isPangram);
    
    // Update counts for milestones
    setLastFoundWordsCount(newFoundWords.length);
    
  }, [currentWord, centerLetter, foundWords, letters, score, maxScore, addCelebration, clearValidation]);

  // Save game progress to user profile
  const saveGameProgress = useCallback(async (words, currentScore, foundPangram) => {
    if (!currentPuzzle) return;
    
    const gameData = {
      puzzleId: currentPuzzle.puzzleId,
      date: new Date(),
      letters,
      centerLetter,
      foundWords: words,
      totalWords: allValidWords.length,
      score: currentScore,
      maxScore,
      achievementLevel: getAchievementLevel(currentScore, maxScore),
      isGenius: currentScore >= maxScore * 0.8,
      pangramCount: words.filter(word => new Set(word.split('')).size === 7).length,
      timeSpent: Math.round((Date.now() - gameStartTime) / 1000)
    };
    
    userProfile.recordGameSession(gameData);
    
    // Update user stats
    const updatedStats = userProfile.getStatsSummary();
    setUserStats(updatedStats);
    setCurrentStreak(userProfile.profile.currentStreak);
  }, [currentPuzzle, letters, centerLetter, allValidWords, maxScore, gameStartTime]);
  
  // Get achievement level name
  const getAchievementLevel = (score, maxScore) => {
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    if (percentage >= 80) return 'Genius';
    if (percentage >= 70) return 'Amazing';
    if (percentage >= 60) return 'Great';
    if (percentage >= 50) return 'Nice';
    if (percentage >= 40) return 'Solid';
    if (percentage >= 30) return 'Good';
    if (percentage >= 20) return 'Moving Up';
    if (percentage >= 10) return 'Good Start';
    return 'Beginner';
  };

  // Get achievement emoji
  const getAchievementEmoji = (score, maxScore) => {
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    if (percentage >= 80) return '🏆';
    if (percentage >= 70) return '🌟';
    if (percentage >= 60) return '🎉';
    if (percentage >= 50) return '👍';
    if (percentage >= 40) return '💪';
    if (percentage >= 30) return '😊';
    if (percentage >= 20) return '⬆️';
    if (percentage >= 10) return '🌱';
    return '🐣';
  };

  // Get next level progress message
  const getNextLevelProgress = (score, maxScore) => {
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const nextThreshold = percentage >= 80 ? 100 : Math.ceil((percentage + 1) / 10) * 10;
    const pointsNeeded = Math.ceil(maxScore * nextThreshold / 100) - score;
    
    if (percentage >= 80) {
      return 'You achieved Genius! 🎊';
    }
    
    const nextLevel = nextThreshold >= 80 ? 'Genius' : 
                     nextThreshold >= 70 ? 'Amazing' :
                     nextThreshold >= 60 ? 'Great' :
                     nextThreshold >= 50 ? 'Nice' :
                     nextThreshold >= 40 ? 'Solid' :
                     nextThreshold >= 30 ? 'Good' :
                     nextThreshold >= 20 ? 'Moving Up' :
                     nextThreshold >= 10 ? 'Good Start' : 'Beginner';
    
    return `${pointsNeeded} points to ${nextLevel}`;
  };
  
  // Optimized keyboard handling
  useKeyboardOptimization(useCallback((e) => {
    const key = e.key.toLowerCase();
    
    if (key === 'enter') {
      handleSubmit();
    } else if (key === 'backspace') {
      handleDelete();
    } else if (key === 'escape') {
      handleClear();
    } else if (key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleShuffle();
    } else if (key.match(/[a-z]/) && letters.map(l => l.toLowerCase()).includes(key)) {
      handleLetterClick(key.toUpperCase());
    }
  }, [letters, handleSubmit, handleDelete, handleClear, handleLetterClick, handleShuffle]));

  if (isLoading) {
    return (
      <div className="game-board loading">
        <h1>Spelling Bee</h1>
        <p>Loading word dictionary...</p>
      </div>
    );
  }

  return (
    <div className="game-board">
      <header className="game-header">
        <h1>Spelling Bee</h1>
        <EnhancedGameStats 
          score={score} 
          maxScore={maxScore}
          foundWords={foundWords.length}
          totalWords={allValidWords.length}
          userStats={userStats}
          currentStreak={currentStreak}
          achievementLevel={getAchievementLevel(score, maxScore)}
          timeRemaining={timeToNextPuzzle}
        />
      </header>

      <main className="game-main">
        <div className="honeycomb-section">
          <Honeycomb 
            letters={letters}
            centerLetter={centerLetter}
            onLetterClick={handleLetterClick}
          />
        </div>

        <div className="word-input-section">
          <div 
            className="current-level-display" 
            data-level={getAchievementLevel(score, maxScore).toLowerCase()}
          >
            <div className="level-badge">
              <span className="level-emoji">{getAchievementEmoji(score, maxScore)}</span>
              <span className="level-name">{getAchievementLevel(score, maxScore)}</span>
            </div>
            <div className="level-progress">
              {getNextLevelProgress(score, maxScore)}
            </div>
          </div>
          
          <div 
            className={`current-word ${validationState.isValid === false ? 'invalid' : ''} ${validationState.isValid === true ? 'valid' : ''}`}
            ref={wordInputRef}
          >
            {currentWord || <span className="placeholder">Type or click letters</span>}
            {validationState.isChecking && <span className="checking">...</span>}
          </div>
          
          {(message || validationState.error) && (
            <div className={`message ${
              message && (message.includes('✅') || message.includes('🎉') || message.includes('🌟') || message.includes('🏆')) 
                ? 'success' 
                : validationState.error || message.includes('!')  
                  ? 'error'
                  : 'info'
            }`}>
              {validationState.error || message}
            </div>
          )}
          
          <div className="word-actions">
            <button onClick={handleDelete} disabled={!currentWord}>
              Delete
            </button>
            <button onClick={handleClear} disabled={!currentWord}>
              Clear
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={!currentWord}
              className="submit-btn"
            >
              Submit
            </button>
          </div>
          
          <div className="shuffle-section">
            <button onClick={handleShuffle} className="shuffle-btn">
              🔀 Shuffle Letters
            </button>
          </div>
        </div>

        <div className="game-controls">
          <button onClick={loadTodaysPuzzle} className="new-puzzle-btn">
            {timeToNextPuzzle > 0 ? 'Reload Today\'s Puzzle' : 'Get New Puzzle'}
          </button>
        </div>
      </main>

      <aside className="game-sidebar">
        <WordList 
          foundWords={foundWords}
          allValidWords={allValidWords}
          showHints={userProfile.profile.preferences.showHints}
        />
      </aside>
      
      <CelebrationSystem 
        celebrations={celebrations}
        celebrationsEnabled={userProfile.profile.preferences.celebrationsEnabled}
        onCelebrationComplete={(celebration) => {
          console.log('Celebration completed:', celebration);
        }}
      />
    </div>
  );
};

export default GameBoard;