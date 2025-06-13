import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import TripCard from '../molecules/TripCard';
import SkeletonLoader from '../molecules/SkeletonLoader';
import ErrorState from '../molecules/ErrorState';
import EmptyState from '../molecules/EmptyState';
import { tripService } from '@/services';

const MyTrips = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    filterAndSortTrips();
  }, [trips, searchQuery, statusFilter, sortBy]);

  const loadTrips = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const tripsData = await tripService.getAll();
      setTrips(tripsData);
    } catch (err) {
      setError(err.message || 'Failed to load trips');
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTrips = () => {
    let filtered = [...trips];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(trip =>
        trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(trip => trip.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'date':
        filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        break;
      case 'budget':
        filtered.sort((a, b) => b.budget - a.budget);
        break;
      default:
        break;
    }

    setFilteredTrips(filtered);
  };

  const handleCreateTrip = () => {
    navigate('/trip-wizard');
  };

  const handleViewTrip = (trip) => {
    if (trip.status === 'active') {
      navigate('/current-trip');
    } else {
      // For non-active trips, we can show a detailed view
      toast.info(`Viewing ${trip.name} - Detailed view coming soon!`);
    }
  };

  const handleEditTrip = (trip) => {
    navigate(`/trip-wizard?edit=${trip.id}`);
  };

  const handleDeleteTrip = async (trip) => {
    if (window.confirm(`Are you sure you want to delete "${trip.name}"? This action cannot be undone.`)) {
      try {
        await tripService.delete(trip.id);
        toast.success('Trip deleted successfully');
        loadTrips();
      } catch (err) {
        toast.error('Failed to delete trip');
      }
    }
  };

  const handleDuplicateTrip = async (trip) => {
    try {
      const duplicatedTrip = {
        ...trip,
        name: `${trip.name} (Copy)`,
        status: 'planning',
        // Reset dates - user will need to update them
        startDate: '',
        endDate: ''
      };
      
      await tripService.create(duplicatedTrip);
      toast.success('Trip duplicated successfully');
      loadTrips();
    } catch (err) {
      toast.error('Failed to duplicate trip');
    }
  };

  const getStatusCounts = () => {
    return {
      all: trips.length,
      planning: trips.filter(t => t.status === 'planning').length,
      active: trips.filter(t => t.status === 'active').length,
      completed: trips.filter(t => t.status === 'completed').length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="w-64 h-8 bg-surface-200 rounded animate-pulse"></div>
          <div className="w-32 h-10 bg-surface-200 rounded animate-pulse"></div>
        </div>
        <SkeletonLoader count={6} type="trip" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Trips"
        message={error}
        onRetry={loadTrips}
        className="m-6"
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 font-heading">
            My Trips
          </h1>
          <p className="text-surface-600 mt-1">
            Manage all your travel adventures
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

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-surface-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search Bar */}
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full lg:w-64"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-surface-700">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-surface-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">All ({statusCounts.all})</option>
                <option value="planning">Planning ({statusCounts.planning})</option>
                <option value="active">Active ({statusCounts.active})</option>
                <option value="completed">Completed ({statusCounts.completed})</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-surface-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-surface-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="date">Travel Date</option>
                <option value="budget">Budget (High to Low)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Trips List */}
      {filteredTrips.length === 0 ? (
        trips.length === 0 ? (
          <EmptyState
            title="No Trips Yet"
            description="Start planning your first adventure with our AI-powered trip planner"
            actionLabel="Create Your First Trip"
            onAction={handleCreateTrip}
            icon="Luggage"
          />
        ) : (
          <EmptyState
            title="No Trips Found"
            description="Try adjusting your search or filter criteria"
            icon="Search"
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative group">
                  <TripCard
                    trip={trip}
                    onView={handleViewTrip}
                    onEdit={handleEditTrip}
                    onDelete={handleDeleteTrip}
                  />
                  
                  {/* Additional Actions Menu */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="MoreVertical"
                        className="bg-white/90 backdrop-blur-sm shadow-sm"
                        onClick={() => {
                          // Simple duplicate action for now
                          handleDuplicateTrip(trip);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Summary Stats */}
      {trips.length > 0 && (
        <div className="bg-surface-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Trip Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {trips.length}
              </div>
              <div className="text-sm text-surface-600">Total Trips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {statusCounts.completed}
              </div>
              <div className="text-sm text-surface-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                ${trips.reduce((sum, trip) => sum + trip.budget, 0).toLocaleString()}
              </div>
              <div className="text-sm text-surface-600">Total Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {new Set(trips.map(trip => trip.destination)).size}
              </div>
              <div className="text-sm text-surface-600">Destinations</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTrips;