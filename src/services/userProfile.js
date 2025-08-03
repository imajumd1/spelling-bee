/**
 * User Profile Service
 * Manages user progress, statistics, and spelling bee history
 */

class UserProfileService {
  constructor() {
    this.storageKey = 'spellingBeeProfile';
    this.profile = this.loadProfile();
  }

  /**
   * Load user profile from localStorage
   */
  loadProfile() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const profile = JSON.parse(stored);
        return {
          // Ensure all required fields exist with defaults
          ...this.getDefaultProfile(),
          ...profile,
          // Ensure dates are Date objects
          createdAt: new Date(profile.createdAt || Date.now()),
          lastPlayed: profile.lastPlayed ? new Date(profile.lastPlayed) : null,
          history: profile.history || []
        };
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
    
    return this.getDefaultProfile();
  }

  /**
   * Get default profile structure
   */
  getDefaultProfile() {
    return {
      // Basic info
      createdAt: new Date(),
      lastPlayed: null,
      
      // Overall statistics
      totalGamesPlayed: 0,
      totalWordsFound: 0,
      totalPangramsFound: 0,
      totalScore: 0,
      geniusCount: 0,
      currentStreak: 0,
      longestStreak: 0,
      
      // Achievement levels reached
      achievementHistory: {
        genius: 0,
        amazing: 0,
        great: 0,
        nice: 0,
        solid: 0,
        good: 0,
        movingUp: 0,
        goodStart: 0,
        beginner: 0
      },
      
      // Daily game history (last 30 days)
      history: [],
      
      // Current preferences
      preferences: {
        showHints: false,
        sortOrder: 'alphabetical', // 'alphabetical' or 'length'
        celebrationsEnabled: true,
        soundEnabled: false
      }
    };
  }

  /**
   * Save profile to localStorage
   */
  saveProfile() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  /**
   * Record a completed game session
   */
  recordGameSession(gameData) {
    const {
      puzzleId,
      date,
      letters,
      centerLetter,
      foundWords,
      totalWords,
      score,
      maxScore,
      achievementLevel,
      isGenius,
      pangramCount,
      timeSpent
    } = gameData;

    // Create session record
    const session = {
      puzzleId,
      date: new Date(date),
      letters: letters.join(''),
      centerLetter,
      foundWords: [...foundWords],
      totalWords,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      achievementLevel,
      isGenius,
      pangramCount,
      timeSpent: timeSpent || 0,
      wordsFoundCount: foundWords.length
    };

    // Update history (keep last 30 days)
    this.profile.history.unshift(session);
    this.profile.history = this.profile.history.slice(0, 30);

    // Update overall statistics
    this.profile.totalGamesPlayed++;
    this.profile.totalWordsFound += foundWords.length;
    this.profile.totalPangramsFound += pangramCount;
    this.profile.totalScore += score;
    this.profile.lastPlayed = new Date();

    if (isGenius) {
      this.profile.geniusCount++;
    }

    // Update achievement history
    const achievementKey = achievementLevel.toLowerCase().replace(/\s+/g, '');
    if (this.profile.achievementHistory[achievementKey] !== undefined) {
      this.profile.achievementHistory[achievementKey]++;
    }

    // Update streak
    this.updateStreak(isGenius);

    this.saveProfile();
    return session;
  }

  /**
   * Update streak counters
   */
  updateStreak(isGenius) {
    const today = new Date().toDateString();
    const lastSession = this.profile.history[1]; // Second item (first is today's session we just added)
    
    if (lastSession) {
      const lastDate = new Date(lastSession.date).toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      if (lastDate === yesterday && isGenius) {
        // Continue streak
        this.profile.currentStreak = (lastSession.isGenius ? this.profile.currentStreak : 0) + 1;
      } else if (isGenius) {
        // Start new streak
        this.profile.currentStreak = 1;
      } else {
        // Break streak
        this.profile.currentStreak = 0;
      }
    } else if (isGenius) {
      // First game
      this.profile.currentStreak = 1;
    }

    // Update longest streak
    if (this.profile.currentStreak > this.profile.longestStreak) {
      this.profile.longestStreak = this.profile.currentStreak;
    }
  }

  /**
   * Get today's game session (if exists)
   */
  getTodaysSession(puzzleId) {
    const today = new Date().toDateString();
    return this.profile.history.find(session => 
      new Date(session.date).toDateString() === today && 
      session.puzzleId === puzzleId
    );
  }

  /**
   * Update preferences
   */
  updatePreferences(newPreferences) {
    this.profile.preferences = {
      ...this.profile.preferences,
      ...newPreferences
    };
    this.saveProfile();
  }

  /**
   * Get user statistics summary
   */
  getStatsSummary() {
    const averageScore = this.profile.totalGamesPlayed > 0 
      ? Math.round(this.profile.totalScore / this.profile.totalGamesPlayed) 
      : 0;

    const averageWords = this.profile.totalGamesPlayed > 0 
      ? Math.round(this.profile.totalWordsFound / this.profile.totalGamesPlayed)
      : 0;

    const geniusRate = this.profile.totalGamesPlayed > 0 
      ? Math.round((this.profile.geniusCount / this.profile.totalGamesPlayed) * 100)
      : 0;

    return {
      gamesPlayed: this.profile.totalGamesPlayed,
      totalScore: this.profile.totalScore,
      averageScore,
      totalWords: this.profile.totalWordsFound,
      averageWords,
      totalPangrams: this.profile.totalPangramsFound,
      geniusCount: this.profile.geniusCount,
      geniusRate,
      currentStreak: this.profile.currentStreak,
      longestStreak: this.profile.longestStreak,
      lastPlayed: this.profile.lastPlayed
    };
  }

  /**
   * Get recent achievements for celebration
   */
  getRecentAchievements() {
    const recentSessions = this.profile.history.slice(0, 5);
    const achievements = [];

    recentSessions.forEach((session, index) => {
      if (index === 0) { // Today's session
        if (session.isGenius) {
          achievements.push({
            type: 'genius',
            message: '🏆 Genius Achievement!',
            date: session.date
          });
        }
        
        if (session.pangramCount > 0) {
          achievements.push({
            type: 'pangram',
            message: `🌟 Found ${session.pangramCount} pangram${session.pangramCount > 1 ? 's' : ''}!`,
            date: session.date
          });
        }
      }
    });

    // Streak achievements
    if (this.profile.currentStreak >= 7) {
      achievements.push({
        type: 'streak',
        message: `🔥 ${this.profile.currentStreak} day genius streak!`,
        date: new Date()
      });
    }

    return achievements;
  }

  /**
   * Export profile data for backup
   */
  exportProfile() {
    return {
      ...this.profile,
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Import profile data from backup
   */
  importProfile(profileData) {
    try {
      this.profile = {
        ...this.getDefaultProfile(),
        ...profileData,
        createdAt: new Date(profileData.createdAt),
        lastPlayed: profileData.lastPlayed ? new Date(profileData.lastPlayed) : null,
        history: profileData.history.map(session => ({
          ...session,
          date: new Date(session.date)
        }))
      };
      this.saveProfile();
      return true;
    } catch (error) {
      console.error('Error importing profile:', error);
      return false;
    }
  }

  /**
   * Reset profile (for testing or user request)
   */
  resetProfile() {
    this.profile = this.getDefaultProfile();
    this.saveProfile();
  }
}

// Export singleton instance
export const userProfile = new UserProfileService();
export default userProfile;