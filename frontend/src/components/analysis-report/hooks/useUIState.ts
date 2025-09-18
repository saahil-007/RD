import { useState, useCallback, useRef, useEffect } from 'react';
import { TabId } from '../constants/config';

/**
 * Hook for managing tab navigation state
 */
export const useTabNavigation = (defaultTab: TabId = 'overview') => {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);
  const [visitedTabs, setVisitedTabs] = useState<Set<TabId>>(new Set([defaultTab]));

  const navigateToTab = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
    setVisitedTabs(prev => new Set(prev).add(tabId));
  }, []);

  const hasVisitedTab = useCallback((tabId: TabId) => {
    return visitedTabs.has(tabId);
  }, [visitedTabs]);

  return {
    activeTab,
    visitedTabs: Array.from(visitedTabs),
    navigateToTab,
    hasVisitedTab,
  };
};

/**
 * Hook for managing animation states and sequences
 */
export const useAnimationSequence = () => {
  const [animationState, setAnimationState] = useState<'idle' | 'running' | 'complete'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startAnimation = useCallback((duration: number = 2000) => {
    setAnimationState('running');
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setAnimationState('complete');
    }, duration);
  }, []);

  const resetAnimation = useCallback(() => {
    setAnimationState('idle');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    animationState,
    startAnimation,
    resetAnimation,
    isAnimating: animationState === 'running',
    isComplete: animationState === 'complete',
  };
};

/**
 * Hook for managing responsive behavior
 */
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  };
};

/**
 * Hook for managing image loading states
 */
export const useImageLoader = (imageUrl: string) => {
  const [loadingState, setLoadingState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setLoadingState('error');
      return;
    }

    setLoadingState('loading');
    const img = new Image();
    
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
      setLoadingState('loaded');
    };
    
    img.onerror = () => {
      setLoadingState('error');
    };
    
    img.src = imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  return {
    loadingState,
    dimensions,
    isLoading: loadingState === 'loading',
    isLoaded: loadingState === 'loaded',
    hasError: loadingState === 'error',
  };
};

/**
 * Hook for managing scroll-based animations
 */
export const useScrollAnimation = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold]);

  return { ref, isVisible };
};