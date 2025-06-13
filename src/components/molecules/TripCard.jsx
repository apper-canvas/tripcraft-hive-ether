import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import ApperIcon from '../ApperIcon';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';

const TripCard = ({ trip, onView, onEdit, onDelete }) => {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const duration = differenceInDays(endDate, startDate) + 1;
  
  const getStatusVariant = (status) => {
    const variants = {
      active: 'success',
      planning: 'warning',
      completed: 'primary'
    };
    return variants[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Active',
      planning: 'Planning',
      completed: 'Completed'
    };
    return labels[status] || status;
  };

  return (
    <Card hover className="relative overflow-hidden">
      {/* Trip Image/Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-surface-900 truncate font-heading">
              {trip.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <ApperIcon name="MapPin" className="w-4 h-4 text-surface-500" />
              <span className="text-surface-600 truncate">{trip.destination}</span>
            </div>
          </div>
          
          <Badge variant={getStatusVariant(trip.status)} size="sm">
            {getStatusLabel(trip.status)}
          </Badge>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm text-surface-500 mb-1">Duration</div>
            <div className="font-semibold text-surface-900">
              {duration} day{duration !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-surface-500 mb-1">Budget</div>
            <div className="font-semibold text-surface-900">
              ${trip.budget.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="mb-6">
          <div className="text-sm text-surface-500 mb-2">Travel Dates</div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">
              {format(startDate, 'MMM d, yyyy')}
            </span>
            <ApperIcon name="ArrowRight" className="w-4 h-4 text-surface-400" />
            <span className="font-medium">
              {format(endDate, 'MMM d, yyyy')}
            </span>
          </div>
        </div>

        {/* Interests Tags */}
        {trip.interests && trip.interests.length > 0 && (
          <div className="mb-6">
            <div className="text-sm text-surface-500 mb-2">Interests</div>
            <div className="flex flex-wrap gap-2">
              {trip.interests.slice(0, 3).map((interest, index) => (
                <Badge key={index} variant="primary" size="sm">
                  {interest}
                </Badge>
              ))}
              {trip.interests.length > 3 && (
                <Badge variant="default" size="sm">
                  +{trip.interests.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-4 border-t border-surface-200">
          <Button 
            variant="primary" 
            size="sm" 
            icon="Eye"
            onClick={() => onView?.(trip)}
            className="flex-1"
          >
            View Trip
          </Button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit?.(trip)}
            className="p-2 text-surface-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete?.(trip)}
            className="p-2 text-surface-600 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </Card>
  );
};

export default TripCard;