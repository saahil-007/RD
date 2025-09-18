import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Eye, Palette } from 'lucide-react';

interface AnalysisLoadingProps {
  progress?: number;
  currentStep?: string;
  estimatedTime?: number;
}

const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({ 
  progress = 0, 
  currentStep = "Initializing...", 
  estimatedTime = 0 
}) => {
  const icons = [
    { Icon: Target, color: "text-blue-500", delay: 0 },
    { Icon: Eye, color: "text-green-500", delay: 0.2 },
    { Icon: Palette, color: "text-purple-500", delay: 0.4 },
    { Icon: Sparkles, color: "text-orange-500", delay: 0.6 }
  ];

  const circleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const iconVariants = {
    animate: (delay: number) => ({
      y: [-10, 10, -10],
      rotate: [0, 180, 360],
      transition: {
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut" as const
      }
    })
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${progress}%`,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {/* Central Mandala Animation */}
      <div className="relative mb-8">
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 w-32 h-32 rounded-full border-4 border-gradient-to-r from-orange-400 to-pink-400 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle ring */}
        <motion.div
          className="absolute inset-2 w-28 h-28 rounded-full border-2 border-gradient-to-r from-blue-400 to-purple-400 opacity-30"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner circle with pulsing effect */}
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 flex items-center justify-center"
          variants={circleVariants}
          animate="animate"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>

        {/* Floating Icons around the circle */}
        {icons.map(({ Icon, color, delay }, index) => {
          const angle = (index * 90) * (Math.PI / 180); // 90 degrees apart
          const radius = 60;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={index}
              className={`absolute w-10 h-10 rounded-full bg-background shadow-lg flex items-center justify-center ${color}`}
              style={{
                left: `calc(50% + ${x}px - 20px)`,
                top: `calc(50% + ${y}px - 20px)`,
              }}
              variants={iconVariants}
              animate="animate"
              custom={delay}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
          );
        })}
      </div>

      {/* Progress Section */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between items-center mb-2">
          <motion.h3 
            className="text-lg font-semibold text-foreground"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎨 Analyzing Rangoli Pattern
          </motion.h3>
          <div className="text-sm font-medium text-muted-foreground">
            {Math.round(progress)}%
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 rounded-full"
            variants={progressVariants}
            initial="initial"
            animate="animate"
          />
        </div>
        
        {/* Current Step */}
        <motion.p 
          className="text-sm text-muted-foreground mt-3 text-center"
          key={currentStep} // Re-trigger animation on step change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep}
        </motion.p>

        {/* Estimated Time */}
        {estimatedTime > 0 && (
          <motion.p 
            className="text-xs text-muted-foreground/80 mt-1 text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ⏱️ Est. {estimatedTime}s remaining
          </motion.p>
        )}
      </div>

      {/* Animated Dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"
            variants={dotVariants}
            animate="animate"
            transition={{ delay: index * 0.2 }}
          />
        ))}
      </div>

      {/* Inspirational Text */}
      <motion.div 
        className="mt-8 text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-sm text-muted-foreground italic font-playfair">
          "Every rangoli tells a story of tradition, spirituality, and artistic devotion"
        </p>
      </motion.div>
    </div>
  );
};

export default AnalysisLoading;