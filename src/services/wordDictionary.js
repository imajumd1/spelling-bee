/**
 * Word Dictionary Service
 * Handles loading and validating words against a large corpus
 */

class WordDictionary {
  constructor() {
    this.words = new Set();
    this.isLoaded = false;
    this.loadPromise = null;
  }

  /**
   * Load word list from multiple sources
   */
  async loadDictionary() {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this._fetchWordList();
    return this.loadPromise;
  }

  async _fetchWordList() {
    try {
      // Start with fallback immediately for faster loading
      this._loadFallbackDictionary();
      console.log('Using fallback dictionary for immediate gameplay');
      
      // Try to fetch enhanced dictionary in background (with timeout)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 5000) // 5 second timeout
      );
      
      const sources = [
        // English words corpus - this is a public API with a large word list
        'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt',
        // Backup: smaller but reliable list
        'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa.txt'
      ];

      for (const source of sources) {
        try {
          console.log(`Attempting to load enhanced dictionary from: ${source}`);
          const fetchPromise = fetch(source);
          const response = await Promise.race([fetchPromise, timeoutPromise]);
          
          if (response.ok) {
            const text = await response.text();
            const wordList = text.split('\n')
              .map(word => word.trim().toLowerCase())
              .filter(word => {
                // Filter for Spelling Bee rules
                return word.length >= 4 && 
                       /^[a-z]+$/.test(word) && // Only letters
                       !word.includes('-') && // No hyphens
                       !word.includes("'"); // No apostrophes
              });

            if (wordList.length > this.words.size) {
              this.words = new Set(wordList);
              console.log(`Enhanced dictionary loaded: ${this.words.size} words`);
            }
            return;
          }
        } catch (error) {
          console.warn(`Failed to load from ${source}:`, error);
          continue;
        }
      }

    } catch (error) {
      console.error('Failed to load dictionary:', error);
      // Fallback already loaded, so we're good to go
    }
  }

  _loadFallbackDictionary() {
    // Enhanced fallback word list for immediate gameplay
    const fallbackWords = [
      // Common 4-letter words
      'able', 'back', 'ball', 'band', 'bank', 'base', 'beat', 'been', 'bell', 'best',
      'bill', 'bird', 'blow', 'blue', 'boat', 'body', 'book', 'born', 'both', 'boys',
      'came', 'camp', 'card', 'care', 'case', 'cast', 'cats', 'city', 'club', 'coal',
      'coat', 'cold', 'come', 'cool', 'copy', 'corn', 'cost', 'cute', 'cuts', 'dark',
      'date', 'days', 'dead', 'deal', 'dear', 'deep', 'desk', 'does', 'done', 'door',
      'down', 'draw', 'drop', 'each', 'earn', 'easy', 'edge', 'else', 'even', 'ever',
      'face', 'fact', 'fail', 'fair', 'fall', 'farm', 'fast', 'fear', 'feel', 'feet',
      'fell', 'felt', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish',
      'five', 'flat', 'flow', 'food', 'foot', 'form', 'fort', 'four', 'free', 'from',
      'full', 'fund', 'game', 'gave', 'gift', 'girl', 'give', 'glad', 'goes', 'gold',
      'gone', 'good', 'gray', 'grew', 'grow', 'half', 'hall', 'hand', 'hang', 'hard',
      'harm', 'hate', 'have', 'head', 'hear', 'heat', 'held', 'help', 'here', 'hide',
      'high', 'hill', 'hire', 'hold', 'hole', 'holy', 'home', 'hope', 'hour', 'huge',
      'hung', 'hunt', 'hurt', 'idea', 'into', 'iron', 'item', 'jobs', 'join', 'jump',
      'just', 'keep', 'kept', 'kids', 'kill', 'kind', 'king', 'knew', 'know', 'lack',
      'lady', 'laid', 'lake', 'land', 'lane', 'last', 'late', 'lead', 'left', 'legs',
      'less', 'life', 'lift', 'like', 'line', 'list', 'live', 'loan', 'lock', 'long',
      'look', 'lord', 'lose', 'loss', 'lost', 'lots', 'love', 'made', 'mail', 'main',
      'make', 'male', 'many', 'mass', 'meal', 'mean', 'meat', 'meet', 'mild', 'mile',
      'milk', 'mind', 'mine', 'miss', 'mode', 'mood', 'moon', 'more', 'most', 'move',
      'much', 'mull', 'must', 'name', 'near', 'neck', 'need', 'news', 'next', 'nice', 'nine',
      'noon', 'nose', 'note', 'open', 'oral', 'over', 'pace', 'pack', 'page', 'paid',
      'pain', 'pair', 'palm', 'park', 'part', 'pass', 'past', 'path', 'pick', 'pink',
      'plan', 'play', 'plot', 'plus', 'pole', 'poll', 'pool', 'poor', 'port', 'post',
      'pull', 'pure', 'push', 'quit', 'race', 'rain', 'rank', 'rate', 'read', 'real',
      'rear', 'rely', 'rent', 'rest', 'rich', 'ride', 'ring', 'rise', 'risk', 'road',
      'rock', 'role', 'roll', 'room', 'root', 'rose', 'rule', 'runs', 'safe', 'said',
      'sail', 'sale', 'salt', 'same', 'sand', 'save', 'seat', 'seed', 'seek', 'seem',
      'seen', 'self', 'sell', 'send', 'sent', 'ship', 'shop', 'shot', 'show', 'shut',
      'sick', 'side', 'sign', 'sing', 'site', 'size', 'skin', 'slip', 'slow', 'snow',
      'soft', 'soil', 'sold', 'sole', 'some', 'song', 'soon', 'sort', 'soul', 'spot',
      'star', 'stay', 'step', 'stop', 'such', 'sure', 'take', 'tale', 'talk', 'tall',
      'tank', 'tape', 'task', 'team', 'tell', 'tend', 'term', 'test', 'text', 'than',
      'that', 'them', 'then', 'they', 'thin', 'this', 'thus', 'tide', 'tied', 'time',
      'tiny', 'told', 'tone', 'took', 'tool', 'tour', 'town', 'tree', 'trip', 'true',
      'tune', 'turn', 'twin', 'type', 'unit', 'upon', 'used', 'user', 'vary', 'vast',
      'very', 'view', 'vote', 'wage', 'wait', 'wake', 'walk', 'wall', 'want', 'ward',
      'warm', 'warn', 'wash', 'wave', 'ways', 'weak', 'wear', 'week', 'well', 'went',
      'were', 'west', 'what', 'when', 'wide', 'wife', 'wild', 'will', 'wind', 'wine',
      'wing', 'wire', 'wise', 'wish', 'with', 'wood', 'word', 'wore', 'work', 'yard',
      'year', 'your', 'zone',
      
      // Common 5+ letter words for better gameplay
      'about', 'above', 'abuse', 'adult', 'after', 'again', 'agent', 'agree', 'ahead',
      'alarm', 'album', 'alert', 'alien', 'align', 'alike', 'alive', 'allow', 'alone',
      'along', 'alter', 'among', 'anger', 'angle', 'angry', 'apart', 'apple', 'apply',
      'arena', 'argue', 'arise', 'array', 'arrow', 'aside', 'asset', 'avoid', 'awake',
      'award', 'aware', 'badly', 'baker', 'bases', 'basic', 'beach', 'began', 'begin',
      'being', 'below', 'bench', 'billy', 'birth', 'black', 'blame', 'blank', 'blind',
      'block', 'blood', 'board', 'boost', 'booth', 'bound', 'brain', 'brand', 'brave',
      'bread', 'break', 'breed', 'brief', 'bring', 'broad', 'broke', 'brown', 'brush',
      'build', 'built', 'buyer', 'cable', 'calif', 'carry', 'catch', 'cause', 'chain',
      'chair', 'chaos', 'charm', 'chart', 'chase', 'cheap', 'check', 'chest', 'chief',
      'child', 'china', 'chose', 'civil', 'claim', 'class', 'clean', 'clear', 'click',
      'climb', 'clock', 'close', 'cloud', 'coach', 'coast', 'could', 'count', 'court',
      'cover', 'craft', 'crash', 'crazy', 'cream', 'crime', 'cross', 'crowd', 'crown',
      'crude', 'curve', 'cycle', 'daily', 'dance', 'dated', 'dealt', 'death', 'debut',
      'delay', 'depth', 'doing', 'doubt', 'dozen', 'draft', 'drama', 'drank', 'dream',
      'dress', 'drill', 'drink', 'drive', 'drove', 'dying', 'eager', 'early', 'earth',
      'eight', 'elite', 'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal', 'error',
      'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false', 'fault', 'fiber',
      'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'fixed', 'flash', 'fleet',
      'floor', 'fluid', 'focus', 'force', 'forth', 'forty', 'forum', 'found', 'frame',
      'frank', 'fraud', 'fresh', 'front', 'fruit', 'fully', 'funny', 'giant', 'given',
      'glass', 'globe', 'going', 'grace', 'grade', 'grand', 'grant', 'grass', 'grave',
      'great', 'green', 'gross', 'group', 'grown', 'guard', 'guess', 'guest', 'guide',
      'happy', 'harry', 'heart', 'heavy', 'hence', 'henry', 'horse', 'hotel', 'house',
      'human', 'ideal', 'image', 'index', 'inner', 'input', 'issue', 'japan', 'jimmy',
      'joint', 'jones', 'judge', 'known', 'label', 'large', 'laser', 'later', 'laugh',
      'layer', 'learn', 'lease', 'least', 'leave', 'legal', 'level', 'lewis', 'light',
      'limit', 'links', 'lives', 'local', 'loose', 'lower', 'lucky', 'lunch', 'lying',
      'magic', 'major', 'maker', 'march', 'maria', 'match', 'maybe', 'mayor', 'meant',
      'media', 'metal', 'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month',
      'moral', 'motor', 'mount', 'mouse', 'mouth', 'moved', 'movie', 'music', 'needs',
      'never', 'newly', 'night', 'noise', 'north', 'noted', 'novel', 'nurse', 'occur',
      'ocean', 'offer', 'often', 'order', 'organ', 'other', 'ought', 'paint', 'panel',
      'paper', 'party', 'peace', 'peter', 'phase', 'phone', 'photo', 'piano', 'piece',
      'pilot', 'pitch', 'place', 'plain', 'plane', 'plant', 'plate', 'point', 'pound',
      'power', 'press', 'price', 'pride', 'prime', 'print', 'prior', 'prize', 'proof',
      'proud', 'prove', 'queen', 'quick', 'quiet', 'quite', 'radio', 'raise', 'range',
      'rapid', 'ratio', 'reach', 'ready', 'realm', 'rebel', 'refer', 'relax', 'repay',
      'reply', 'right', 'rigid', 'rival', 'river', 'robin', 'roger', 'roman', 'rough',
      'round', 'route', 'royal', 'rural', 'scale', 'scene', 'scope', 'score', 'sense',
      'serve', 'setup', 'seven', 'shall', 'shape', 'share', 'sharp', 'sheet', 'shelf',
      'shell', 'shift', 'shine', 'shirt', 'shock', 'shoot', 'short', 'shown', 'sided',
      'sight', 'since', 'sixth', 'sixty', 'sized', 'skill', 'sleep', 'slide', 'small',
      'smart', 'smile', 'smith', 'smoke', 'snake', 'snow', 'solid', 'solve', 'sorry',
      'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend', 'spent', 'split',
      'spoke', 'sport', 'staff', 'stage', 'stake', 'stand', 'start', 'state', 'steam',
      'steel', 'steep', 'steer', 'steve', 'stick', 'still', 'stock', 'stone', 'stood',
      'store', 'storm', 'story', 'strip', 'stuck', 'study', 'stuff', 'style', 'sugar',
      'suite', 'super', 'sweet', 'swift', 'swing', 'swiss', 'table', 'taken', 'taste',
      'taxes', 'teach', 'teams', 'teens', 'teeth', 'terry', 'texas', 'thank', 'theft',
      'their', 'theme', 'there', 'these', 'thick', 'thing', 'think', 'third', 'those',
      'three', 'threw', 'throw', 'thumb', 'tiger', 'tight', 'tired', 'title', 'today',
      'token', 'topic', 'total', 'touch', 'tough', 'tower', 'track', 'trade', 'train',
      'treat', 'trend', 'trial', 'tribe', 'trick', 'tried', 'tries', 'truck', 'truly',
      'trust', 'truth', 'twice', 'uncle', 'under', 'undue', 'union', 'unity', 'until',
      'upper', 'upset', 'urban', 'usage', 'usual', 'valid', 'value', 'video', 'virus',
      'visit', 'vital', 'vocal', 'voice', 'waste', 'watch', 'water', 'wheel', 'where',
      'which', 'while', 'white', 'whole', 'whose', 'woman', 'women', 'world', 'worry',
      'worse', 'worst', 'worth', 'would', 'write', 'wrong', 'wrote', 'young', 'youth'
    ];

    this.words = new Set(fallbackWords);
    this.isLoaded = true;
    console.log('Using enhanced fallback dictionary:', this.words.size, 'words');
  }

  /**
   * Check if a word exists in the dictionary
   */
  isValidWord(word) {
    if (!this.isLoaded) {
      console.warn('Dictionary not loaded yet');
      return false;
    }
    return this.words.has(word.toLowerCase());
  }

  /**
   * Get all valid words that can be formed from given letters with center letter required
   */
  findValidWords(letters, centerLetter) {
    if (!this.isLoaded) {
      return [];
    }

    const availableLetters = letters.map(l => l.toLowerCase());
    const center = centerLetter.toLowerCase();
    const validWords = [];

    for (const word of this.words) {
      if (this.canFormWord(word, availableLetters, center)) {
        validWords.push(word);
      }
    }

    return validWords.sort();
  }

  /**
   * Check if a word can be formed from available letters with center letter required
   */
  canFormWord(word, availableLetters, centerLetter) {
    // Must contain center letter
    if (!word.includes(centerLetter)) {
      return false;
    }

    // Must be at least 4 letters
    if (word.length < 4) {
      return false;
    }

    // Convert to lowercase for comparison
    const wordLower = word.toLowerCase();
    const centerLower = centerLetter.toLowerCase();
    const availableLower = availableLetters.map(l => l.toLowerCase());

    // Check if word contains center letter
    if (!wordLower.includes(centerLower)) {
      return false;
    }

    // Check if all letters in word are available
    // In Spelling Bee, letters can be reused unlimited times
    for (const letter of wordLower) {
      if (!availableLower.includes(letter)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get dictionary stats
   */
  getStats() {
    return {
      isLoaded: this.isLoaded,
      wordCount: this.words.size
    };
  }
}

// Export singleton instance
export const wordDictionary = new WordDictionary();
export default wordDictionary;