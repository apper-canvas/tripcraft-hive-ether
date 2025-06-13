import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 1, type = 'card', className = '' }) => {
  const renderSkeleton = (type) => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white rounded-lg border border-surface-200 p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-surface-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-surface-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-surface-200 rounded"></div>
                <div className="h-3 bg-surface-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        );
      
      case 'trip':
        return (
          <div className="bg-white rounded-lg border border-surface-200 p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-surface-200 rounded w-2/3"></div>
                  <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-surface-200 rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-3 bg-surface-200 rounded w-16"></div>
                  <div className="h-4 bg-surface-200 rounded w-20"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-surface-200 rounded w-16"></div>
                  <div className="h-4 bg-surface-200 rounded w-24"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 bg-surface-200 rounded flex-1"></div>
                <div className="w-8 h-8 bg-surface-200 rounded"></div>
                <div className="w-8 h-8 bg-surface-200 rounded"></div>
              </div>
            </div>
          </div>
        );
      
      case 'activity':
        return (
          <div className="bg-white rounded-lg border border-surface-200 p-4 shadow-sm">
            <div className="animate-pulse space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-surface-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                </div>
                <div className="w-12 h-4 bg-surface-200 rounded"></div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-surface-200 rounded w-3/4"></div>
            <div className="h-4 bg-surface-200 rounded w-1/2"></div>
            <div className="h-4 bg-surface-200 rounded w-5/6"></div>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton(type)}
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;