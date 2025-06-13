import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';

const TripWizardForm = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: 1,
    interests: [],
    accommodationType: 'hotel',
    transportMode: 'flight'
  });
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    {
      id: 'basic',
      title: 'Trip Basics',
      description: 'Tell us about your trip'
    },
    {
      id: 'dates',
      title: 'Travel Dates',
      description: 'When are you traveling?'
    },
    {
      id: 'budget',
      title: 'Budget & Travelers',
      description: 'Set your budget and group size'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'What are you interested in?'
    }
  ];

  const interestOptions = [
    { id: 'culture', label: 'Culture & History', icon: 'Building' },
    { id: 'food', label: 'Food & Dining', icon: 'Utensils' },
    { id: 'nature', label: 'Nature & Outdoors', icon: 'TreePine' },
    { id: 'art', label: 'Art & Museums', icon: 'Palette' },
    { id: 'nightlife', label: 'Nightlife', icon: 'Music' },
    { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag' },
    { id: 'adventure', label: 'Adventure Sports', icon: 'Mountain' },
    { id: 'wellness', label: 'Wellness & Spa', icon: 'Heart' },
    { id: 'photography', label: 'Photography', icon: 'Camera' },
    { id: 'beaches', label: 'Beaches', icon: 'Waves' }
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const toggleInterest = (interestId) => {
    const currentInterests = formData.interests || [];
    const updatedInterests = currentInterests.includes(interestId)
      ? currentInterests.filter(id => id !== interestId)
      : [...currentInterests, interestId];
    
    updateFormData('interests', updatedInterests);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Basic info
        if (!formData.name.trim()) newErrors.name = 'Trip name is required';
        if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
        break;
      
      case 1: // Dates
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
          newErrors.endDate = 'End date must be after start date';
        }
        break;
      
      case 2: // Budget & travelers
        if (!formData.budget || formData.budget <= 0) newErrors.budget = 'Valid budget is required';
        if (!formData.travelers || formData.travelers <= 0) newErrors.travelers = 'Number of travelers is required';
        break;
      
      case 3: // Preferences
        if (!formData.interests || formData.interests.length === 0) {
          newErrors.interests = 'Please select at least one interest';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsGenerating(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const tripData = {
        ...formData,
        budget: parseFloat(formData.budget),
        travelers: parseInt(formData.travelers)
      };
      
      onComplete(tripData);
      toast.success('Trip itinerary generated successfully!');
    } catch (error) {
      toast.error('Failed to generate itinerary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <FormField
              label="Trip Name"
              placeholder="e.g., Tokyo Adventure 2024"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              error={errors.name}
              required
            />
            
            <FormField
              label="Destination"
              placeholder="e.g., Tokyo, Japan"
              icon="MapPin"
              value={formData.destination}
              onChange={(e) => updateFormData('destination', e.target.value)}
              error={errors.destination}
              required
            />
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6">
            <FormField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => updateFormData('startDate', e.target.value)}
              error={errors.startDate}
              required
            />
            
            <FormField
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => updateFormData('endDate', e.target.value)}
              error={errors.endDate}
              required
            />
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <FormField
              label="Total Budget (USD)"
              type="number"
              placeholder="e.g., 3000"
              icon="DollarSign"
              value={formData.budget}
              onChange={(e) => updateFormData('budget', e.target.value)}
              error={errors.budget}
              required
            />
            
            <FormField
              label="Number of Travelers"
              type="number"
              min="1"
              max="10"
              value={formData.travelers}
              onChange={(e) => updateFormData('travelers', e.target.value)}
              error={errors.travelers}
              required
            />
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-4">
                What are you interested in? (Select all that apply)
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map((interest) => (
                  <motion.button
                    key={interest.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleInterest(interest.id)}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-200 text-left
                      ${formData.interests.includes(interest.id)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-surface-200 hover:border-surface-300'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <ApperIcon 
                        name={interest.icon} 
                        className={`w-5 h-5 ${
                          formData.interests.includes(interest.id) 
                            ? 'text-primary' 
                            : 'text-surface-500'
                        }`} 
                      />
                      <span className="text-sm font-medium">{interest.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              {errors.interests && (
                <p className="mt-2 text-sm text-error">{errors.interests}</p>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <Card className="text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-6"
        >
          <ApperIcon name="Sparkles" className="w-16 h-16 text-secondary" />
        </motion.div>
        <h3 className="text-xl font-semibold text-surface-900 mb-2">
          Crafting Your Perfect Itinerary
        </h3>
        <p className="text-surface-600 mb-6">
          Our AI is analyzing your preferences and finding the best activities, restaurants, and experiences...
        </p>
        <div className="w-full bg-surface-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
            animate={{ width: ['0%', '100%'] }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          />
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${index <= currentStep 
                  ? 'bg-primary text-white' 
                  : 'bg-surface-200 text-surface-500'
                }
              `}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-12 h-1 mx-2
                  ${index < currentStep ? 'bg-primary' : 'bg-surface-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-surface-900 font-heading">
            {steps[currentStep].title}
          </h2>
          <p className="text-surface-600 mt-1">
            {steps[currentStep].description}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={currentStep === 0 ? onCancel : prevStep}
          icon={currentStep === 0 ? "X" : "ArrowLeft"}
        >
          {currentStep === 0 ? 'Cancel' : 'Previous'}
        </Button>

        <div className="flex space-x-3">
          {currentStep < steps.length - 1 ? (
            <Button
              variant="primary"
              onClick={nextStep}
              icon="ArrowRight"
              iconPosition="right"
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              icon="Sparkles"
              loading={isGenerating}
            >
              Generate Itinerary
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripWizardForm;