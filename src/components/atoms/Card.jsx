import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'md',
  shadow = 'sm',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };
  
  const baseClasses = `
    bg-white rounded-lg border border-surface-200 
    ${paddingClasses[padding]} 
    ${shadowClasses[shadow]}
    ${className}
  `;
  
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`${baseClasses} cursor-pointer transition-shadow duration-200 hover:shadow-lg`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;