import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, differenceInDays } from 'date-fns';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import ItineraryTimeline from '../organisms/ItineraryTimeline';
import MapView from '../organisms/MapView';
import BudgetRing from '../molecules/BudgetRing';
import SkeletonLoader from '../molecules/SkeletonLoader';
import ErrorState from '../molecules/ErrorState';
import EmptyState from '../molecules/EmptyState';
import { tripService, itineraryService, budgetService } from '@/services';

const CurrentTrip = () => {
  const navigate = useNavigate();
  const [currentTrip, setCurrentTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [budget, setBudget] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [viewMode, setViewMode] = useState('timeline'); // timeline, map, budget
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCurrentTrip();
  }, []);

  const loadCurrentTrip = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const trip = await tripService.getCurrentTrip();
      
      if (!trip) {
        setError('No active trip found');
        return;
      }
      
      setCurrentTrip(trip);
      
      // Load itinerary and budget in parallel
      const [itineraryData, budgetData] = await Promise.all([
        itineraryService.getByTripId(trip.id).catch(() => null),
        budgetService.getByTripId(trip.id).catch(() => null)
      ]);
      
      setItinerary(itineraryData);
      setBudget(budgetData);
      
    } catch (err) {
      setError(err.message || 'Failed to load current trip');
      toast.error('Failed to load current trip');
    } finally {
      setLoading(false);
    }
  };

  const handleActivityEdit = (activity) => {
    // TODO: Open activity edit modal
    toast.info('Activity editing coming soon!');
  };

  const handleActivityDelete = async (activity) => {
    if (window.confirm(`Are you sure you want to remove "${activity.name}" from the itinerary?`)) {
      toast.info('Activity deletion coming soon!');
    }
  };

  const handleExportItinerary = () => {
    toast.info('Itinerary export coming soon!');
  };

  const handleShareTrip = () => {
    toast.info('Trip sharing coming soon!');
  };

  const getTripProgress = () => {
    if (!currentTrip) return 0;
    
    const today = new Date();
    const startDate = new Date(currentTrip.startDate);
    const endDate = new Date(currentTrip.endDate);
    
    if (today < startDate) return 0;
    if (today > endDate) return 100;
    
    const totalDays = differenceInDays(endDate, startDate) + 1;
    const daysPassed = differenceInDays(today, startDate) + 1;
    
    return Math.round((daysPassed / totalDays) * 100);
  };

  const renderViewContent = () => {
    switch (viewMode) {
      case 'timeline':
        return (
          <ItineraryTimeline
            itinerary={itinerary}
            onActivityEdit={handleActivityEdit}
            onActivityDelete={handleActivityDelete}
          />
        );
      
      case 'map':
        return (
          <MapView
            itinerary={itinerary}
            selectedDay={selectedDay}
            onActivitySelect={(activity) => {
              toast.info(`Selected: ${activity.name}`);
            }}
          />
        );
      
      case 'budget':
        return (
          <div className="p-6">
            {budget ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <BudgetRing
                  category="accommodation"
                  spent={budget.accommodation * 0.7}
                  budget={budget.accommodation}
                />
                <BudgetRing
                  category="transport"
                  spent={budget.transport * 0.5}
                  budget={budget.transport}
                />
                <BudgetRing
                  category="activities"
                  spent={budget.activities * 0.8}
                  budget={budget.activities}
                />
                <BudgetRing
                  category="food"
                  spent={budget.food * 0.6}
                  budget={budget.food}
                />
                <BudgetRing
                  category="other"
                  spent={budget.other * 0.3}
                  budget={budget.other}
                />
              </div>
            ) : (
              <EmptyState
                title="No Budget Data"
                description="Budget breakdown will appear here once available"
                icon="DollarSign"
              />
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="h-full p-6">
        <SkeletonLoader count={1} type="trip" />
        <div className="mt-6">
          <SkeletonLoader count={3} type="activity" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Current Trip Error"
        message={error}
        onRetry={loadCurrentTrip}
        className="m-6"
      />
    );
  }

  if (!currentTrip) {
    return (
      <EmptyState
        title="No Active Trip"
        description="You don't have any active trips. Create a new trip to get started!"
        actionLabel="Create New Trip"
        onAction={() => navigate('/trip-wizard')}
        icon="MapPin"
        className="m-6"
      />
    );
  }

  const progress = getTripProgress();
  const duration = differenceInDays(new Date(currentTrip.endDate), new Date(currentTrip.startDate)) + 1;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Trip Header */}
      <div className="flex-shrink-0 bg-white border-b border-surface-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-surface-900 font-heading">
                  {currentTrip.name}
                </h1>
                <Badge variant="success">Active</Badge>
              </div>
              
              <div className="flex items-center space-x-6 text-surface-600">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="MapPin" className="w-4 h-4" />
                  <span>{currentTrip.destination}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  <span>
                    {format(new Date(currentTrip.startDate), 'MMM d')} - {format(new Date(currentTrip.endDate), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Clock" className="w-4 h-4" />
                  <span>{duration} days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Users" className="w-4 h-4" />
                  <span>{currentTrip.travelers} traveler{currentTrip.travelers !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                icon="Share"
                onClick={handleShareTrip}
              >
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="Download"
                onClick={handleExportItinerary}
              >
                Export
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon="Edit2"
                onClick={() => navigate(`/trip-wizard?edit=${currentTrip.id}`)}
              >
                Edit Trip
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-surface-700">Trip Progress</span>
              <span className="text-sm text-surface-600">{progress}% complete</span>
            </div>
            <div className="w-full bg-surface-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center space-x-1 bg-surface-100 p-1 rounded-lg w-fit">
            {[
              { id: 'timeline', label: 'Timeline', icon: 'Calendar' },
              { id: 'map', label: 'Map', icon: 'Map' },
              { id: 'budget', label: 'Budget', icon: 'DollarSign' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${viewMode === mode.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-surface-600 hover:text-surface-900'
                  }
                `}
              >
                <ApperIcon name={mode.icon} className="w-4 h-4" />
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'timeline' || viewMode === 'map' ? (
          <div className="h-full grid grid-cols-1 lg:grid-cols-2">
            {/* Left Panel - Timeline or Map */}
            <div className="border-r border-surface-200 overflow-hidden">
              {viewMode === 'timeline' ? (
                <ItineraryTimeline
                  itinerary={itinerary}
                  onActivityEdit={handleActivityEdit}
                  onActivityDelete={handleActivityDelete}
                />
              ) : (
                <MapView
                  itinerary={itinerary}
                  selectedDay={selectedDay}
                  onActivitySelect={(activity) => {
                    toast.info(`Selected: ${activity.name}`);
                  }}
                />
              )}
            </div>

            {/* Right Panel - Map or Timeline */}
            <div className="overflow-hidden">
              {viewMode === 'timeline' ? (
                <MapView
                  itinerary={itinerary}
                  selectedDay={selectedDay}
                  onActivitySelect={(activity) => {
                    toast.info(`Selected: ${activity.name}`);
                  }}
                />
              ) : (
                <ItineraryTimeline
                  itinerary={itinerary}
                  onActivityEdit={handleActivityEdit}
                  onActivityDelete={handleActivityDelete}
                />
              )}
            </div>
          </div>
        ) : (
          renderViewContent()
        )}
      </div>
    </div>
  );
};

export default CurrentTrip;