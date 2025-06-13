import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';

const ActivityCard = ({ activity, onEdit, onDelete, showActions = true }) => {
  const getActivityIcon = (type) => {
    const icons = {
      attraction: 'MapPin',
      restaurant: 'Utensils',
      activity: 'Calendar',
      transport: 'Car',
      hotel: 'Bed'
    };
    return icons[type] || 'MapPin';
  };

  const getActivityColor = (type) => {
    const colors = {
      attraction: 'text-secondary',
      restaurant: 'text-accent',
      activity: 'text-primary',
      transport: 'text-surface-600',
      hotel: 'text-success'
    };
    return colors[type] || 'text-surface-600';
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  return (
    <Card hover className="relative">
      <div className="flex items-start space-x-4">
        {/* Activity Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center ${getActivityColor(activity.type)}`}>
          <ApperIcon name={getActivityIcon(activity.type)} className="w-5 h-5" />
        </div>

        {/* Activity Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-surface-900 truncate">
                {activity.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <ApperIcon name="MapPin" className="w-4 h-4 text-surface-400" />
                <span className="text-sm text-surface-600 truncate">
                  {activity.location.name}
                </span>
              </div>
            </div>
            
            {/* Cost */}
            <div className="flex-shrink-0 text-right">
              <div className="text-lg font-bold text-surface-900">
                ${activity.cost}
              </div>
              <div className="text-xs text-surface-500">
                {formatDuration(activity.duration)}
              </div>
            </div>
          </div>

          {/* Activity Meta */}
          <div className="flex items-center space-x-4 mt-3">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Clock" className="w-4 h-4 text-surface-400" />
              <span className="text-sm text-surface-600">{activity.time}</span>
            </div>
            <Badge variant="default" size="sm">
              {activity.type}
            </Badge>
          </div>

          {/* Description */}
          {activity.description && (
            <p className="text-sm text-surface-600 mt-2 line-clamp-2">
              {activity.description}
            </p>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex items-center space-x-2 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit?.(activity)}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
                <span>Edit</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete?.(activity)}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-error hover:bg-error/10 rounded-lg transition-colors"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
                <span>Remove</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ActivityCard;