import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';

const ErrorState = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading your data.",
  onRetry,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      {/* Error Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4"
      >
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
      </motion.div>

      {/* Error Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-2 mb-6"
      >
        <h3 className="text-lg font-semibold text-surface-900">
          {title}
        </h3>
        <p className="text-surface-600 max-w-md">
          {message}
        </p>
      </motion.div>

      {/* Retry Button */}
      {onRetry && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="primary"
            icon="RefreshCw"
            onClick={onRetry}
          >
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorState;