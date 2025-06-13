import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const BudgetRing = ({ category, spent, budget, color = 'primary' }) => {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getIcon = (category) => {
    const icons = {
      accommodation: 'Bed',
      transport: 'Car',
      activities: 'Calendar',
      food: 'Utensils',
      other: 'ShoppingBag'
    };
    return icons[category] || 'DollarSign';
  };

  const getColor = (category) => {
    const colors = {
      accommodation: 'text-success',
      transport: 'text-primary',
      activities: 'text-secondary',
      food: 'text-accent',
      other: 'text-surface-600'
    };
    return colors[category] || 'text-primary';
  };

  const getStrokeColor = (category) => {
    const colors = {
      accommodation: '#10b981',
      transport: '#2563eb',
      activities: '#7c3aed',
      food: '#f59e0b',
      other: '#64748b'
    };
    return colors[category] || '#2563eb';
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Ring Chart */}
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e2e8f0"
            strokeWidth="8"
            fill="none"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={getStrokeColor(category)}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center Icon */}
        <div className={`absolute inset-0 flex items-center justify-center ${getColor(category)}`}>
          <ApperIcon name={getIcon(category)} className="w-6 h-6" />
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <div className="text-sm font-semibold text-surface-900 capitalize">
          {category}
        </div>
        <div className="text-xs text-surface-500">
          ${spent} / ${budget}
        </div>
        <div className="text-xs font-medium text-surface-700">
          {percentage.toFixed(0)}% used
        </div>
      </div>
    </div>
  );
};

export default BudgetRing;