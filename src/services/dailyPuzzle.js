/**
 * Daily Puzzle Service
 * Manages daily puzzle generation and scheduling at 10am PST
 */

import wordDictionary from './wordDictionary';

class DailyPuzzleService {
  constructor() {
    this.storageKey = 'spellingBeeDailyPuzzles';
    this.targetTime = { hour: 10, minute: 0 }; // 10:00 AM PST
    this.puzzleCache = this.loadPuzzleCache();
  }

  /**
   * Load cached puzzles from localStorage
   */
  loadPuzzleCache() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const cache = JSON.parse(stored);
        // Convert date strings back to Date objects
        Object.keys(cache).forEach(dateKey => {
          cache[dateKey].generatedAt = new Date(cache[dateKey].generatedAt);
        });
        return cache;
      }
    } catch (error) {
      console.error('Error loading puzzle cache:', error);
    }
    return {};
  }

  /**
   * Save puzzle cache to localStorage
   */
  savePuzzleCache() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.puzzleCache));
    } catch (error) {
      console.error('Error saving puzzle cache:', error);
    }
  }

  /**
   * Get Pacific Time for consistent puzzle timing
   */
  getPacificTime() {
    const now = new Date();
    // Convert to Pacific Time (UTC-8 or UTC-7 depending on DST)
    const pacificTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
    return pacificTime;
  }

  /**
   * Get date key for puzzle identification (YYYY-MM-DD format)
   */
  getDateKey(date = null) {
    const targetDate = date || this.getPacificTime();
    return targetDate.toISOString().split('T')[0];
  }

  /**
   * Check if it's time for a new puzzle (after 10am PST)
   */
  isTimeForNewPuzzle() {
    const now = this.getPacificTime();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    return hour > this.targetTime.hour || 
           (hour === this.targetTime.hour && minute >= this.targetTime.minute);
  }

  /**
   * Get the current puzzle date (considering 10am PST cutoff)
   */
  getCurrentPuzzleDate() {
    const now = this.getPacificTime();
    
    if (this.isTimeForNewPuzzle()) {
      return now;
    } else {
      // Before 10am, use yesterday's puzzle
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    }
  }

  /**
   * Generate a seed from date for consistent puzzle generation
   */
  generateSeed(date) {
    const dateStr = this.getDateKey(date);
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      const char = dateStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Seeded random number generator for consistent results
   */
  seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Generate letters for a puzzle based on date seed
   */
  generatePuzzleLetters(date) {
    const seed = this.generateSeed(date);
    let currentSeed = seed;

    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const commonConsonants = ['R', 'S', 'T', 'L', 'N', 'D', 'C', 'H', 'F', 'P', 'G', 'M', 'B', 'W', 'Y', 'V', 'K'];
    const allLetters = [...vowels, ...commonConsonants];

    // Ensure at least one vowel
    currentSeed += 1;
    const vowelIndex = Math.floor(this.seededRandom(currentSeed) * vowels.length);
    const selectedLetters = [vowels[vowelIndex]];

    // Add 6 more letters, avoiding duplicates
    while (selectedLetters.length < 7) {
      currentSeed += 1;
      const letterIndex = Math.floor(this.seededRandom(currentSeed) * allLetters.length);
      const letter = allLetters[letterIndex];
      
      if (!selectedLetters.includes(letter)) {
        selectedLetters.push(letter);
      }
    }

    // First letter (vowel) becomes center letter
    const centerLetter = selectedLetters[0];

    return {
      letters: selectedLetters,
      centerLetter
    };
  }

  /**
   * Validate puzzle quality (ensure enough valid words)
   */
  async validatePuzzle(letters, centerLetter) {
    if (!wordDictionary.isLoaded) {
      await wordDictionary.loadDictionary();
    }

    const validWords = wordDictionary.findValidWords(letters, centerLetter);
    const pangramCount = validWords.filter(word => {
      const uniqueLetters = new Set(word.split(''));
      return uniqueLetters.size === 7;
    }).length;

    // Calculate total possible score
    const totalScore = validWords.reduce((sum, word) => {
      let wordScore = word.length === 4 ? 1 : word.length;
      const uniqueLetters = new Set(word.split(''));
      if (uniqueLetters.size === 7) {
        wordScore += 7; // Pangram bonus
      }
      return sum + wordScore;
    }, 0);

    // Quality criteria
    const isValid = validWords.length >= 20 && // At least 20 words
                    validWords.length <= 100 && // Not too many words
                    pangramCount >= 1 && // At least 1 pangram
                    totalScore >= 50 && // Reasonable score range
                    totalScore <= 200;

    return {
      isValid,
      validWords,
      pangramCount,
      totalScore,
      wordCount: validWords.length
    };
  }

  /**
   * Generate puzzle with quality validation
   */
  async generateQualityPuzzle(date, maxAttempts = 50) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const adjustedDate = new Date(date);
      adjustedDate.setHours(adjustedDate.getHours() + attempt); // Slight variation for different attempts
      
      const { letters, centerLetter } = this.generatePuzzleLetters(adjustedDate);
      const validation = await this.validatePuzzle(letters, centerLetter);

      if (validation.isValid) {
        return {
          letters,
          centerLetter,
          validWords: validation.validWords,
          maxScore: validation.totalScore,
          pangramCount: validation.pangramCount,
          wordCount: validation.wordCount,
          generatedAt: new Date(),
          attempt: attempt + 1
        };
      }
    }

    // Fallback: use best attempt even if not ideal
    console.warn('Could not generate ideal puzzle, using fallback');
    const { letters, centerLetter } = this.generatePuzzleLetters(date);
    const validation = await this.validatePuzzle(letters, centerLetter);
    
    return {
      letters,
      centerLetter,
      validWords: validation.validWords,
      maxScore: validation.totalScore,
      pangramCount: validation.pangramCount,
      wordCount: validation.wordCount,
      generatedAt: new Date(),
      attempt: maxAttempts,
      isFallback: true
    };
  }

  /**
   * Get today's puzzle
   */
  async getTodaysPuzzle() {
    const puzzleDate = this.getCurrentPuzzleDate();
    const dateKey = this.getDateKey(puzzleDate);

    // Check if we have today's puzzle cached
    if (this.puzzleCache[dateKey]) {
      return {
        ...this.puzzleCache[dateKey],
        puzzleId: dateKey,
        isFromCache: true
      };
    }

    // Generate new puzzle
    console.log(`Generating new puzzle for ${dateKey}`);
    const puzzle = await this.generateQualityPuzzle(puzzleDate);
    
    // Cache the puzzle
    this.puzzleCache[dateKey] = puzzle;
    this.savePuzzleCache();

    // Clean old puzzles (keep last 7 days)
    this.cleanOldPuzzles();

    return {
      ...puzzle,
      puzzleId: dateKey,
      isFromCache: false
    };
  }

  /**
   * Get puzzle for specific date
   */
  async getPuzzleForDate(date) {
    const dateKey = this.getDateKey(date);

    if (this.puzzleCache[dateKey]) {
      return {
        ...this.puzzleCache[dateKey],
        puzzleId: dateKey,
        isFromCache: true
      };
    }

    // Generate puzzle for specific date
    const puzzle = await this.generateQualityPuzzle(date);
    this.puzzleCache[dateKey] = puzzle;
    this.savePuzzleCache();

    return {
      ...puzzle,
      puzzleId: dateKey,
      isFromCache: false
    };
  }

  /**
   * Clean old puzzles from cache
   */
  cleanOldPuzzles() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7); // Keep 7 days
    const cutoffKey = this.getDateKey(cutoffDate);

    Object.keys(this.puzzleCache).forEach(dateKey => {
      if (dateKey < cutoffKey) {
        delete this.puzzleCache[dateKey];
      }
    });

    this.savePuzzleCache();
  }

  /**
   * Get time until next puzzle
   */
  getTimeUntilNextPuzzle() {
    const now = this.getPacificTime();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(this.targetTime.hour, this.targetTime.minute, 0, 0);

    return tomorrow.getTime() - now.getTime();
  }

  /**
   * Get puzzle statistics
   */
  getPuzzleStats() {
    const cacheSize = Object.keys(this.puzzleCache).length;
    const oldestPuzzle = Math.min(...Object.keys(this.puzzleCache));
    const newestPuzzle = Math.max(...Object.keys(this.puzzleCache));

    return {
      cachedPuzzles: cacheSize,
      oldestDate: oldestPuzzle,
      newestDate: newestPuzzle,
      nextPuzzleIn: this.getTimeUntilNextPuzzle()
    };
  }
}

// Export singleton instance
export const dailyPuzzle = new DailyPuzzleService();
export default dailyPuzzle;