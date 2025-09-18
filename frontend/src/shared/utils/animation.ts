/**
 * Animation utility functions using Framer Motion.
 */
import { Variants } from 'framer-motion';
import { ANALYSIS_CONFIG } from '../constants';

/**
 * Fade in animation variant
 */
export const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: ANALYSIS_CONFIG.ANIMATION.duration.normal,
      ease: ANALYSIS_CONFIG.ANIMATION.ease.easeOut
    }
  }
};

/**
 * Scale in animation variant
 */
export const scaleInVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8 
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANALYSIS_CONFIG.ANIMATION.duration.normal,
      ease: ANALYSIS_CONFIG.ANIMATION.ease.easeOut
    }
  }
};

/**
 * Slide in from left variant
 */
export const slideInLeftVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: -50 
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: ANALYSIS_CONFIG.ANIMATION.duration.normal,
      ease: ANALYSIS_CONFIG.ANIMATION.ease.easeOut
    }
  }
};

/**
 * Slide in from right variant
 */
export const slideInRightVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: 50 
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: ANALYSIS_CONFIG.ANIMATION.duration.normal,
      ease: ANALYSIS_CONFIG.ANIMATION.ease.easeOut
    }
  }
};

/**
 * Stagger container variant
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANALYSIS_CONFIG.ANIMATION.stagger,
      delayChildren: 0.1
    }
  }
};

/**
 * Stagger item variant
 */
export const staggerItemVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: ANALYSIS_CONFIG.ANIMATION.duration.fast,
      ease: ANALYSIS_CONFIG.ANIMATION.ease.easeOut
    }
  }
};

/**
 * Progress ring animation variant
 */
export const progressRingVariants: Variants = {
  hidden: { 
    pathLength: 0,
    opacity: 0 
  },
  visible: { 
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: ANALYSIS_CONFIG.ANIMATION.duration.slow,
        ease: ANALYSIS_CONFIG.ANIMATION.ease.easeInOut
      },
      opacity: {
        duration: ANALYSIS_CONFIG.ANIMATION.duration.fast
      }
    }
  }
};

/**
 * Bounce animation variant
 */
export const bounceVariants: Variants = {
  hidden: { 
    scale: 0,
    opacity: 0 
  },
  visible: { 
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

/**
 * Create a delayed animation variant
 */
export function createDelayedVariant(delay: number): Variants {
  return {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: ANALYSIS_CONFIG.ANIMATION.duration.normal,
        ease: ANALYSIS_CONFIG.ANIMATION.ease.easeOut,
        delay
      }
    }
  };
}

/**
 * Create a loading pulse variant
 */
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: ANALYSIS_CONFIG.ANIMATION.ease.easeInOut
    }
  }
};