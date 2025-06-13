import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '../ApperIcon';
import ActivityCard from '../molecules/ActivityCard';
import WeatherWidget from '../molecules/WeatherWidget';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';

const ItineraryTimeline = ({ itinerary, onActivityEdit, onActivityDelete }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedActivities, setExpandedActivities] = useState(new Set());

  if (!itinerary || !itinerary.days) {
    return (
      <div className="text-center py-8">
        <ApperIcon name="Calendar" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
        <p className="text-surface-600">No itinerary available</p>
      </div>
    );
  }

  const currentDay = itinerary.days[selectedDay];
  
  const getTotalDayCost = (day) => {
    return day.activities.reduce((total, activity) => total + (activity.cost || 0), 0);
  };

  const getTotalDayDuration = (day) => {
    return day.activities.reduce((total, activity) => total + (activity.duration || 0), 0);
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
    <div className="h-full flex flex-col">
      {/* Day Selector */}
      <div className="flex-shrink-0 border-b border-surface-200 p-4">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
          {itinerary.days.map((day, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDay(index)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${selectedDay === index
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                }
              `}
            >
              <div className="text-center">
                <div className="font-semibold">
                  Day {index + 1}
                </div>
                <div className="text-xs opacity-75">
                  {format(new Date(day.date), 'MMM d')}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Day Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-4 space-y-6"
          >
            {/* Day Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-surface-900 font-heading">
                    {format(new Date(currentDay.date), 'EEEE, MMMM d')}
                  </h2>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-surface-600">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Clock" className="w-4 h-4" />
                      <span>{formatDuration(getTotalDayDuration(currentDay))}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="DollarSign" className="w-4 h-4" />
                      <span>${getTotalDayCost(currentDay)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="MapPin" className="w-4 h-4" />
                      <span>{currentDay.activities.length} activities</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  icon="Plus"
                  onClick={() => {/* Add activity handler */}}
                >
                  Add Activity
                </Button>
              </div>

              {/* Weather Widget */}
              {currentDay.weather && (
                <WeatherWidget 
                  weather={currentDay.weather} 
                  date={currentDay.date} 
                />
              )}
            </div>

            {/* Activities Timeline */}
            <div className="space-y-4">
              {currentDay.activities.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Calendar" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                  <p className="text-surface-600">No activities planned for this day</p>
                  <Button
                    variant="primary"
                    size="sm"
                    icon="Plus"
                    className="mt-4"
                    onClick={() => {/* Add activity handler */}}
                  >
                    Add First Activity
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-surface-200"></div>
                  
                  {currentDay.activities
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-start space-x-6"
                      >
                        {/* Timeline Dot */}
                        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium z-10">
                          {index + 1}
                        </div>
                        
                        {/* Activity Content */}
                        <div className="flex-1 pb-8">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="primary" size="sm">
                              {activity.time}
                            </Badge>
                            <Badge variant="default" size="sm">
                              {formatDuration(activity.duration)}
                            </Badge>
                          </div>
                          
                          <ActivityCard
                            activity={activity}
                            onEdit={onActivityEdit}
                            onDelete={onActivityDelete}
                            showActions={true}
                          />
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ItineraryTimeline;