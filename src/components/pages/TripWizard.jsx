import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TripWizardForm from '../organisms/TripWizardForm';
import { tripService, itineraryService } from '@/services';

const TripWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  
  const editTripId = searchParams.get('edit');

  useEffect(() => {
    if (editTripId) {
      loadTripForEditing();
    }
  }, [editTripId]);

  const loadTripForEditing = async () => {
    setLoading(true);
    try {
      const trip = await tripService.getById(editTripId);
      if (trip) {
        setEditingTrip(trip);
      } else {
        toast.error('Trip not found');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Failed to load trip for editing');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleTripComplete = async (tripData) => {
    try {
      let savedTrip;
      
      if (editingTrip) {
        // Update existing trip
        savedTrip = await tripService.update(editingTrip.id, tripData);
        toast.success('Trip updated successfully!');
      } else {
        // Create new trip
        savedTrip = await tripService.create(tripData);
        
        // Generate AI itinerary
        await itineraryService.generateItinerary(savedTrip);
        toast.success('Trip created and itinerary generated!');
      }
      
      // Navigate to the current trip view if it's active, otherwise to my trips
      if (savedTrip.status === 'active') {
        navigate('/current-trip');
      } else {
        navigate('/my-trips');
      }
    } catch (err) {
      toast.error('Failed to save trip. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-surface-600">Loading trip data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-surface-900 font-heading mb-4">
              {editingTrip ? 'Edit Your Trip' : 'Create Your Perfect Trip'}
            </h1>
            <p className="text-lg text-surface-600 max-w-2xl mx-auto">
              {editingTrip 
                ? 'Update your trip details and preferences'
                : 'Let our AI craft a personalized itinerary based on your preferences, budget, and interests'
              }
            </p>
          </div>

          {/* Trip Wizard Form */}
          <TripWizardForm
            initialData={editingTrip}
            onComplete={handleTripComplete}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default TripWizard;