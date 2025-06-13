import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon = null, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-700 focus:ring-primary shadow-sm',
    secondary: 'bg-secondary text-white hover:bg-purple-800 focus:ring-secondary shadow-sm',
    accent: 'bg-accent text-white hover:bg-amber-600 focus:ring-accent shadow-sm',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 focus:ring-surface-500',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-error shadow-sm'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  
  const iconElement = icon && (
    <ApperIcon 
      name={loading ? 'Loader2' : icon} 
      className={`w-4 h-4 ${loading ? 'animate-spin' : ''} ${
        children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''
      }`} 
    />
  );
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </motion.button>
  );
};

export default Button;