import Input from '../atoms/Input';

const FormField = ({ 
  label, 
  error, 
  required = false, 
  children, 
  className = '',
  ...props 
}) => {
  // If children are provided, render them instead of Input
  if (children) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-surface-700">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        {children}
        {error && (
          <p className="text-sm text-error">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <Input
        label={label}
        error={error}
        required={required}
        {...props}
      />
    </div>
  );
};

export default FormField;