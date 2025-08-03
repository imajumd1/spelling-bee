/**
 * Performance Hook
 * Optimizes user experience with debouncing, caching, and instant feedback
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Debounced state hook for performance optimization
 */
export const useDebouncedState = (initialValue, delay = 300) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return [value, setValue, debouncedValue];
};

/**
 * Instant validation hook for immediate user feedback
 */
export const useInstantValidation = (wordDictionary) => {
  const [cache, setCache] = useState(new Map());
  const [validationState, setValidationState] = useState({
    isValid: null,
    error: null,
    isChecking: false
  });

  const validateWord = useCallback((word, letters, centerLetter) => {
    if (!word || word.length === 0) {
      setValidationState({ isValid: null, error: null, isChecking: false });
      return;
    }

    const cacheKey = `${word}-${letters.join('')}-${centerLetter}`;
    
    // Check cache first for instant response
    if (cache.has(cacheKey)) {
      const cachedResult = cache.get(cacheKey);
      setValidationState({
        isValid: cachedResult.isValid,
        error: cachedResult.error,
        isChecking: false
      });
      return;
    }

    setValidationState({ isValid: null, error: null, isChecking: true });

    // Perform validation
    const validate = () => {
      try {
        let error = null;
        let isValid = false;

        // Basic validations (instant)
        if (word.length < 4) {
          error = 'Too short (4 letters minimum)';
        } else if (!word.toLowerCase().includes(centerLetter.toLowerCase())) {
          error = `Must contain center letter "${centerLetter}"`;
        } else if (!wordDictionary.canFormWord(word, letters, centerLetter.toLowerCase())) {
          error = 'Cannot form with available letters';
        } else if (wordDictionary.isLoaded && !wordDictionary.isValidWord(word)) {
          error = 'Not in word list';
        } else {
          isValid = true;
        }

        const result = { isValid, error };
        
        // Cache result
        setCache(prev => {
          const newCache = new Map(prev);
          newCache.set(cacheKey, result);
          // Limit cache size
          if (newCache.size > 100) {
            const firstKey = newCache.keys().next().value;
            newCache.delete(firstKey);
          }
          return newCache;
        });

        setValidationState({
          isValid,
          error,
          isChecking: false
        });
      } catch (err) {
        setValidationState({
          isValid: false,
          error: 'Validation error',
          isChecking: false
        });
      }
    };

    // Use requestIdleCallback for non-blocking validation
    if (window.requestIdleCallback) {
      window.requestIdleCallback(validate);
    } else {
      setTimeout(validate, 0);
    }
  }, [wordDictionary, cache]);

  return {
    validateWord,
    validationState,
    clearValidation: () => setValidationState({ isValid: null, error: null, isChecking: false })
  };
};

/**
 * Optimized animation hook
 */
export const useOptimizedAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);

  const triggerAnimation = useCallback((element, animationClass, duration = 300) => {
    if (!element || isAnimating) return;

    setIsAnimating(true);
    element.classList.add(animationClass);

    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    animationRef.current = setTimeout(() => {
      element.classList.remove(animationClass);
      setIsAnimating(false);
    }, duration);
  }, [isAnimating]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return { triggerAnimation, isAnimating };
};

/**
 * Keyboard performance hook
 */
export const useKeyboardOptimization = (onKeyPress) => {
  const keyMapRef = useRef(new Map());

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const now = Date.now();
      
      // Prevent rapid-fire key events
      if (keyMapRef.current.has(key)) {
        const lastTime = keyMapRef.current.get(key);
        if (now - lastTime < 50) { // 50ms debounce
          return;
        }
      }
      
      keyMapRef.current.set(key, now);
      onKeyPress(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);
};

/**
 * Preload and cache hook for instant responses
 */
export const usePreloader = () => {
  const [isPreloading, setIsPreloading] = useState(false);
  const preloadCache = useRef(new Map());

  const preloadData = useCallback(async (key, dataLoader) => {
    if (preloadCache.current.has(key)) {
      return preloadCache.current.get(key);
    }

    setIsPreloading(true);
    try {
      const data = await dataLoader();
      preloadCache.current.set(key, data);
      return data;
    } finally {
      setIsPreloading(false);
    }
  }, []);

  const getCachedData = useCallback((key) => {
    return preloadCache.current.get(key);
  }, []);

  return { preloadData, getCachedData, isPreloading };
};

/**
 * Smart update hook to prevent unnecessary re-renders
 */
export const useSmartUpdate = (dependencies) => {
  const prevDepsRef = useRef();
  const [updateId, setUpdateId] = useState(0);

  const hasChanged = dependencies.some((dep, index) => {
    if (!prevDepsRef.current) return true;
    return dep !== prevDepsRef.current[index];
  });

  useEffect(() => {
    if (hasChanged) {
      prevDepsRef.current = dependencies;
      setUpdateId(prev => prev + 1);
    }
  }, [hasChanged]);

  return updateId;
};

/**
 * Performance monitoring hook
 */
export const usePerformanceMonitor = (componentName) => {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  useEffect(() => {
    renderCountRef.current++;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    lastRenderTimeRef.current = now;

    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render #${renderCountRef.current}, ${timeSinceLastRender}ms since last`);
      
      // Warn about frequent re-renders
      if (timeSinceLastRender < 16 && renderCountRef.current > 5) {
        console.warn(`${componentName} may be re-rendering too frequently`);
      }
    }
  });

  return {
    renderCount: renderCountRef.current,
    resetCounter: () => { renderCountRef.current = 0; }
  };
};