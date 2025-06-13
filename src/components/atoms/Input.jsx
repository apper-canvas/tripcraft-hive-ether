import { useState } from 'react';
import ApperIcon from '../ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const hasValue = value && value.length > 0;
  const shouldFloatLabel = focused || hasValue;
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  
  return (
    <div className={`relative ${className}`}>
      {/* Input Container */}
      <div className="relative">
        {/* Leading Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">
            <ApperIcon name={icon} className="w-5 h-5" />
          </div>
        )}
        
        {/* Input Field */}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={!label ? placeholder : ''}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
            ${icon ? 'pl-11' : ''}
            ${isPassword ? 'pr-11' : ''}
            ${error 
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
              : focused 
                ? 'border-primary focus:ring-2 focus:ring-primary/20' 
                : 'border-surface-300 hover:border-surface-400'
            }
            ${disabled ? 'bg-surface-100 text-surface-500 cursor-not-allowed' : 'bg-white'}
            focus:outline-none
          `}
          {...props}
        />
        
        {/* Floating Label */}
        {label && (
          <label
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${icon ? 'left-11' : 'left-4'}
              ${shouldFloatLabel 
                ? 'top-2 text-xs text-surface-500 bg-white px-1 -ml-1' 
                : 'top-1/2 transform -translate-y-1/2 text-surface-600'
              }
              ${error && shouldFloatLabel ? 'text-error' : ''}
              ${focused && !error ? 'text-primary' : ''}
            `}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600"
          >
            <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;