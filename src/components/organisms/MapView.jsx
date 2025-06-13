import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';

const MapView = ({ itinerary, selectedDay = 0, onActivitySelect }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [viewMode, setViewMode] = useState('satellite'); // satellite, street, terrain

  useEffect(() => {
    if (itinerary?.days?.[selectedDay]?.activities?.length > 0) {
      const activities = itinerary.days[selectedDay].activities;
      const avgLat = activities.reduce((sum, act) => sum + act.location.lat, 0) / activities.length;
      const avgLng = activities.reduce((sum, act) => sum + act.location.lng, 0) / activities.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
    }
  }, [itinerary, selectedDay]);

  if (!itinerary || !itinerary.days || !itinerary.days[selectedDay]) {
    return (
      <div className="h-full bg-surface-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Map" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
          <p className="text-surface-600">No itinerary data available</p>
        </div>
      </div>
    );
  }

  const currentDay = itinerary.days[selectedDay];
  const activities = currentDay.activities || [];

  const getMarkerColor = (activityType) => {
    const colors = {
      attraction: '#7c3aed',
      restaurant: '#f59e0b',
      activity: '#2563eb',
      transport: '#64748b',
      hotel: '#10b981'
    };
    return colors[activityType] || '#2563eb';
  };

  const getMarkerIcon = (activityType) => {
    const icons = {
      attraction: 'MapPin',
      restaurant: 'Utensils',
      activity: 'Calendar',
      transport: 'Car',
      hotel: 'Bed'
    };
    return icons[activityType] || 'MapPin';
  };

  const handleMarkerClick = (activity) => {
    setSelectedActivity(activity);
    onActivitySelect?.(activity);
  };

  return (
    <div className="h-full bg-surface-100 rounded-lg overflow-hidden relative">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        {/* View Mode Toggle */}
        <div className="bg-white rounded-lg shadow-md p-1 flex">
          {['satellite', 'street', 'terrain'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === mode
                  ? 'bg-primary text-white'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="bg-white rounded-lg shadow-md flex flex-col">
          <button className="p-2 hover:bg-surface-50 border-b border-surface-200">
            <ApperIcon name="Plus" className="w-4 h-4 text-surface-600" />
          </button>
          <button className="p-2 hover:bg-surface-50">
            <ApperIcon name="Minus" className="w-4 h-4 text-surface-600" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 z-20 bg-white rounded-lg shadow-md p-3">
        <h4 className="text-sm font-semibold text-surface-900 mb-2">Activity Types</h4>
        <div className="space-y-2">
          {['attraction', 'restaurant', 'activity', 'transport', 'hotel'].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getMarkerColor(type) }}
              />
              <span className="text-xs text-surface-600 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Simulation */}
      <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100">
        {/* Simulated street patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="streets" patternUnits="userSpaceOnUse" width="100" height="100">
              <path d="M 0,50 L 100,50" stroke="#64748b" strokeWidth="2"/>
              <path d="M 50,0 L 50,100" stroke="#64748b" strokeWidth="2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#streets)" />
        </svg>

        {/* Activity Markers */}
        {activities.map((activity, index) => {
          const x = 20 + (index * 150) % (window.innerWidth - 200);
          const y = 80 + (Math.floor(index / 4) * 120) % 300;
          
          return (
            <motion.div
              key={activity.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className="absolute cursor-pointer"
              style={{ left: x, top: y }}
              onClick={() => handleMarkerClick(activity)}
            >
              {/* Marker */}
              <div 
                className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-white relative"
                style={{ backgroundColor: getMarkerColor(activity.type) }}
              >
                <ApperIcon name={getMarkerIcon(activity.type)} className="w-5 h-5" />
                
                {/* Marker number */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-xs font-bold text-surface-900 rounded-full flex items-center justify-center shadow">
                  {index + 1}
                </div>
              </div>

              {/* Activity Label */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-md px-2 py-1 min-w-max">
                <div className="text-xs font-semibold text-surface-900 truncate max-w-24">
                  {activity.name}
                </div>
                <div className="text-xs text-surface-600">
                  {activity.time}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Route Lines */}
        {activities.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {activities.slice(0, -1).map((activity, index) => {
              const x1 = 45 + (index * 150) % (window.innerWidth - 200);
              const y1 = 105 + (Math.floor(index / 4) * 120) % 300;
              const x2 = 45 + ((index + 1) * 150) % (window.innerWidth - 200);
              const y2 = 105 + (Math.floor((index + 1) / 4) * 120) % 300;
              
              return (
                <motion.line
                  key={`route-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: (index + 1) * 0.5, duration: 0.8 }}
                />
              );
            })}
          </svg>
        )}
      </div>

      {/* Selected Activity Details */}
      {selectedActivity && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-20"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: getMarkerColor(selectedActivity.type) }}
                >
                  <ApperIcon name={getMarkerIcon(selectedActivity.type)} className="w-3 h-3" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900">
                  {selectedActivity.name}
                </h3>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-surface-600">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="MapPin" className="w-4 h-4" />
                  <span>{selectedActivity.location.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Clock" className="w-4 h-4" />
                  <span>{selectedActivity.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="DollarSign" className="w-4 h-4" />
                  <span>${selectedActivity.cost}</span>
                </div>
              </div>
              
              {selectedActivity.description && (
                <p className="text-sm text-surface-600 mt-2">
                  {selectedActivity.description}
                </p>
              )}
            </div>
            
            <button
              onClick={() => setSelectedActivity(null)}
              className="p-1 text-surface-400 hover:text-surface-600"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {activities.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <ApperIcon name="MapPin" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-surface-900 mb-2">
              No Activities Yet
            </h3>
            <p className="text-surface-600 mb-4">
              Add activities to see them on the map
            </p>
            <Button variant="primary" size="sm" icon="Plus">
              Add Activity
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;