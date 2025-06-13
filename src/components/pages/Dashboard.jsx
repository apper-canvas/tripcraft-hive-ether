import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import TripCard from '../molecules/TripCard';
import SkeletonLoader from '../molecules/SkeletonLoader';
import ErrorState from '../molecules/ErrorState';
import EmptyState from '../molecules/EmptyState';
import { tripService, itineraryService } from '@/services';

const Dashboard = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTrips: 0,
    activeTrips: 0,
    completedTrips: 0,
    totalBudget: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [tripsData] = await Promise.all([
        tripService.getAll()
      ]);
      
      setTrips(tripsData);
      
      // Get current active trip
      const activeTrip = tripsData.find(trip => trip.status === 'active');
      setCurrentTrip(activeTrip);
      
      // Load upcoming activities if there's an active trip
      if (activeTrip) {
        try {
          const itinerary = await itineraryService.getByTripId(activeTrip.id);
          if (itinerary) {
            const today = new Date();
            const upcoming = [];
            
            itinerary.days.forEach(day => {
              const dayDate = new Date(day.date);
              if (isAfter(dayDate, today) || format(dayDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
                day.activities.forEach(activity => {
                  upcoming.push({
                    ...activity,
                    date: day.date,
                    tripName: activeTrip.name
                  });
                });
              }
            });
            
            setUpcomingActivities(upcoming.slice(0, 5));
          }
        } catch (err) {
          console.error('Failed to load upcoming activities:', err);
        }
      }
      
      // Calculate stats
      const statsData = {
        totalTrips: tripsData.length,
        activeTrips: tripsData.filter(t => t.status === 'active').length,
        completedTrips: tripsData.filter(t => t.status === 'completed').length,
        totalBudget: tripsData.reduce((sum, trip) => sum + (trip.budget || 0), 0)
      };
      setStats(statsData);
      
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = () => {
    navigate('/trip-wizard');
  };

  const handleViewTrip = (trip) => {
    if (trip.status === 'active') {
      navigate('/current-trip');
    } else {
      navigate(`/my-trips?trip=${trip.id}`);
    }
  };

  const handleEditTrip = (trip) => {
    navigate(`/trip-wizard?edit=${trip.id}`);
  };

  const handleDeleteTrip = async (trip) => {
    if (window.confirm(`Are you sure you want to delete "${trip.name}"?`)) {
      try {
        await tripService.delete(trip.id);
        toast.success('Trip deleted successfully');
        loadDashboardData();
      } catch (err) {
        toast.error('Failed to delete trip');
      }
    }
  };

  const getUpcomingTrips = () => {
    const today = new Date();
    return trips.filter(trip => {
      const startDate = new Date(trip.startDate);
      return isAfter(startDate, today) && trip.status !== 'completed';
    }).slice(0, 3);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} type="card" />
          ))}
        </div>
        <SkeletonLoader count={3} type="trip" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Dashboard Error"
        message={error}
        onRetry={loadDashboardData}
        className="m-6"
      />
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 font-heading">
            Welcome back!
          </h1>
          <p className="text-surface-600 mt-1">
            Here's what's happening with your trips
          </p>
        </div>
        
        <Button
          variant="primary"
          icon="Plus"
          onClick={handleCreateTrip}
        >
          Create New Trip
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Luggage" className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-surface-900">
              {stats.totalTrips}
            </div>
            <div className="text-sm text-surface-600">Total Trips</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="text-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="PlayCircle" className="w-6 h-6 text-success" />
            </div>
            <div className="text-2xl font-bold text-surface-900">
              {stats.activeTrips}
            </div>
            <div className="text-sm text-surface-600">Active Trips</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-2xl font-bold text-surface-900">
              {stats.completedTrips}
            </div>
            <div className="text-sm text-surface-600">Completed</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-accent" />
            </div>
            <div className="text-2xl font-bold text-surface-900">
              ${stats.totalBudget.toLocaleString()}
            </div>
            <div className="text-sm text-surface-600">Total Budget</div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Trip */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-surface-900 font-heading">
              Current Trip
            </h2>
            {currentTrip && (
              <Button
                variant="outline"
                size="sm"
                icon="Eye"
                onClick={() => handleViewTrip(currentTrip)}
              >
                View Details
              </Button>
            )}
          </div>

          {currentTrip ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <TripCard
                trip={currentTrip}
                onView={handleViewTrip}
                onEdit={handleEditTrip}
                onDelete={handleDeleteTrip}
              />
            </motion.div>
          ) : (
            <EmptyState
              title="No Active Trip"
              description="Start planning your next adventure"
              actionLabel="Create New Trip"
              onAction={handleCreateTrip}
              icon="MapPin"
            />
          )}

          {/* Upcoming Trips */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-surface-900 font-heading">
                Upcoming Trips
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/my-trips')}
              >
                View All
              </Button>
            </div>

            {getUpcomingTrips().length > 0 ? (
              <div className="space-y-4">
                {getUpcomingTrips().map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <TripCard
                      trip={trip}
                      onView={handleViewTrip}
                      onEdit={handleEditTrip}
                      onDelete={handleDeleteTrip}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <ApperIcon name="Calendar" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                <p className="text-surface-600">No upcoming trips planned</p>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Activities */}
          <div>
            <h2 className="text-xl font-semibold text-surface-900 font-heading mb-4">
              Upcoming Activities
            </h2>

            {upcomingActivities.length > 0 ? (
              <div className="space-y-3">
                {upcomingActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Card padding="sm" className="border-l-4 border-l-primary">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ApperIcon 
                            name={activity.type === 'restaurant' ? 'Utensils' : 'MapPin'} 
                            className="w-4 h-4 text-primary" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-surface-900 truncate">
                            {activity.name}
                          </div>
                          <div className="text-xs text-surface-600">
                            {format(new Date(activity.date), 'MMM d')} at {activity.time}
                          </div>
                          <div className="text-xs text-surface-500 mt-1">
                            {activity.tripName}
                          </div>
                        </div>
                        <Badge variant="primary" size="sm">
                          ${activity.cost}
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-6">
                <ApperIcon name="Calendar" className="w-8 h-8 text-surface-400 mx-auto mb-2" />
                <p className="text-sm text-surface-600">No upcoming activities</p>
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-surface-900 font-heading mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                icon="Wand2"
                onClick={handleCreateTrip}
                className="w-full justify-start"
              >
                Create New Trip
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="Compass"
                onClick={() => navigate('/explore')}
                className="w-full justify-start"
              >
                Explore Destinations
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="Luggage"
                onClick={() => navigate('/my-trips')}
                className="w-full justify-start"
              >
                View All Trips
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;