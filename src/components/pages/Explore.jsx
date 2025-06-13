import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import SkeletonLoader from '../molecules/SkeletonLoader';
import { activityService } from '@/services';

const Explore = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const categories = [
    { id: 'all', label: 'All Activities', icon: 'Grid3x3' },
    { id: 'attraction', label: 'Attractions', icon: 'MapPin' },
    { id: 'restaurant', label: 'Restaurants', icon: 'Utensils' },
    { id: 'activity', label: 'Activities', icon: 'Calendar' },
    { id: 'transport', label: 'Transport', icon: 'Car' }
  ];

  const priceRanges = [
    { id: 'all', label: 'All Prices' },
    { id: 'budget', label: 'Budget ($0-$25)', min: 0, max: 25 },
    { id: 'moderate', label: 'Moderate ($26-$75)', min: 26, max: 75 },
    { id: 'premium', label: 'Premium ($76-$150)', min: 76, max: 150 },
    { id: 'luxury', label: 'Luxury ($150+)', min: 150, max: Infinity }
  ];

  const destinations = [
    {
      id: 'tokyo',
      name: 'Tokyo, Japan',
      image: '/images/tokyo.jpg',
      description: 'Experience the perfect blend of traditional culture and modern innovation',
      highlights: ['Temples & Shrines', 'Incredible Food', 'Shopping', 'Technology'],
      averageCost: '$150-300/day'
    },
    {
      id: 'paris',
      name: 'Paris, France',
      image: '/images/paris.jpg',
      description: 'The City of Light offers romance, art, and world-class cuisine',
      highlights: ['Museums & Art', 'Architecture', 'Cuisine', 'Romance'],
      averageCost: '$120-250/day'
    },
    {
      id: 'bali',
      name: 'Bali, Indonesia',
      image: '/images/bali.jpg',
      description: 'Tropical paradise with stunning beaches and rich cultural heritage',
      highlights: ['Beaches', 'Temples', 'Wellness', 'Nature'],
      averageCost: '$50-120/day'
    },
    {
      id: 'newyork',
      name: 'New York, USA',
      image: '/images/nyc.jpg',
      description: 'The city that never sleeps, packed with iconic landmarks and culture',
      highlights: ['Broadway', 'Museums', 'Food Scene', 'Shopping'],
      averageCost: '$200-400/day'
    }
  ];

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchQuery, selectedCategory, priceRange]);

  const loadActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const activitiesData = await activityService.getAll();
      setActivities(activitiesData);
    } catch (err) {
      setError(err.message || 'Failed to load activities');
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = [...activities];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(activity =>
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.location.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(activity => activity.type === selectedCategory);
    }

    // Apply price range filter
    if (priceRange !== 'all') {
      const range = priceRanges.find(r => r.id === priceRange);
      if (range) {
        filtered = filtered.filter(activity => 
          activity.cost >= range.min && activity.cost <= range.max
        );
      }
    }

    setFilteredActivities(filtered);
  };

  const handleCreateTripFromDestination = (destination) => {
    navigate('/trip-wizard', { 
      state: { 
        prefilledDestination: destination.name 
      } 
    });
  };

  const handleActivitySelect = (activity) => {
    toast.info(`${activity.name} - Add to trip feature coming soon!`);
  };

  const getActivityIcon = (type) => {
    const icons = {
      attraction: 'MapPin',
      restaurant: 'Utensils',
      activity: 'Calendar',
      transport: 'Car'
    };
    return icons[type] || 'MapPin';
  };

  const renderDestinationCard = (destination) => (
    <Card key={destination.id} hover className="overflow-hidden">
      {/* Destination Image */}
      <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold font-heading">{destination.name}</h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-surface-600 mb-4">{destination.description}</p>
        
        {/* Highlights */}
        <div className="mb-4">
          <div className="text-sm font-medium text-surface-700 mb-2">Highlights</div>
          <div className="flex flex-wrap gap-2">
            {destination.highlights.map((highlight, index) => (
              <Badge key={index} variant="primary" size="sm">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>

        {/* Average Cost */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-surface-500">Average Cost</div>
            <div className="font-semibold text-surface-900">{destination.averageCost}</div>
          </div>
          
          <Button
            variant="primary"
            size="sm"
            icon="ArrowRight"
            onClick={() => handleCreateTripFromDestination(destination)}
          >
            Plan Trip
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderActivityCard = (activity) => (
    <Card key={activity.id} hover className="group">
      <div className="flex items-start space-x-4">
        {/* Activity Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <ApperIcon name={getActivityIcon(activity.type)} className="w-6 h-6 text-primary" />
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
            
            <div className="flex-shrink-0 text-right">
              <div className="text-lg font-bold text-primary">
                ${activity.cost}
              </div>
              {activity.rating && (
                <div className="flex items-center space-x-1 mt-1">
                  <ApperIcon name="Star" className="w-4 h-4 text-accent fill-current" />
                  <span className="text-sm text-surface-600">{activity.rating}</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-surface-600 mt-2 line-clamp-2">
            {activity.description}
          </p>

          {/* Tags */}
          {activity.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {activity.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="default" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Button */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleActivitySelect(activity)}
            >
              Add to Trip
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="w-64 h-8 bg-surface-200 rounded animate-pulse mb-4"></div>
          <div className="w-96 h-4 bg-surface-200 rounded animate-pulse"></div>
        </div>
        <SkeletonLoader count={6} type="card" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-surface-900 font-heading mb-4">
          Explore Destinations & Activities
        </h1>
        <p className="text-lg text-surface-600">
          Discover amazing places and experiences around the world. Get inspired and start planning your next adventure.
        </p>
      </div>

      {/* Featured Destinations */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-surface-900 font-heading">
            Popular Destinations
          </h2>
          <Button variant="ghost" icon="ArrowRight">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {renderDestinationCard(destination)}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Activities Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-surface-900 font-heading">
            Activities & Experiences
          </h2>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-surface-200 p-4 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-surface-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Price Range Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="border border-surface-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {priceRanges.map(range => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Activities Grid */}
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {renderActivityCard(activity)}
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <ApperIcon name="Search" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-surface-900 mb-2">
              No Activities Found
            </h3>
            <p className="text-surface-600">
              Try adjusting your search criteria or browse our featured destinations above.
            </p>
          </Card>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-secondary rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold font-heading mb-4">
          Ready to Plan Your Next Adventure?
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Let our AI create the perfect itinerary based on your preferences and interests.
        </p>
        <Button
          variant="accent"
          size="lg"
          icon="Sparkles"
          onClick={() => navigate('/trip-wizard')}
        >
          Start Planning with AI
        </Button>
      </section>
    </div>
  );
};

export default Explore;