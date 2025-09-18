import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Maximize2 } from 'lucide-react';
import CountUp from 'react-countup';

interface ImagePreviewProps {
  imageUrl: string;
  score: number;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, score }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div 
      className="relative group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
        <img 
          src={imageUrl} 
          alt="Rangoli Analysis" 
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <div className="absolute top-4 right-4">
          <Maximize2 className="w-5 h-5 text-white" />
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <h3 className="font-bold text-lg">Overall Analysis Score</h3>
              <p className="text-sm opacity-90">Comprehensive Evaluation</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                <CountUp end={score} duration={2} />%
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>Excellent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          >
            <motion.img 
              src={imageUrl}
              alt="Rangoli Analysis - Expanded"
              className="max-w-full max-h-full object-contain rounded-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};