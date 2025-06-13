import itinerariesData from '../mockData/itineraries.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ItineraryService {
  constructor() {
    this.itineraries = [...itinerariesData];
  }

  async getAll() {
    await delay(300);
    return [...this.itineraries];
  }

  async getById(id) {
    await delay(200);
    const itinerary = this.itineraries.find(i => i.id === id);
    return itinerary ? { ...itinerary } : null;
  }

  async getByTripId(tripId) {
    await delay(250);
    const itinerary = this.itineraries.find(i => i.tripId === tripId);
    return itinerary ? { ...itinerary } : null;
  }

  async create(itineraryData) {
    await delay(500);
    const newItinerary = {
      ...itineraryData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString()
    };
    this.itineraries.push(newItinerary);
    return { ...newItinerary };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.itineraries.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Itinerary not found');
    
    this.itineraries[index] = { 
      ...this.itineraries[index], 
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    return { ...this.itineraries[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.itineraries.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Itinerary not found');
    
    this.itineraries.splice(index, 1);
    return true;
  }

  async generateItinerary(tripData) {
    await delay(2000); // Simulate AI processing time
    
    const activities = this.generateActivitiesForTrip(tripData);
    const totalCost = activities.reduce((sum, activity) => sum + activity.cost, 0);
    
    const newItinerary = {
      id: Date.now().toString(),
      tripId: tripData.id,
      days: this.organizeActivitiesByDay(activities, tripData),
      totalCost,
      lastUpdated: new Date().toISOString()
    };
    
    this.itineraries.push(newItinerary);
    return { ...newItinerary };
  }

  generateActivitiesForTrip(tripData) {
    const activities = [];
    const activityTypes = ['attraction', 'restaurant', 'activity', 'transport'];
    const destinations = ['Downtown', 'Old Town', 'Marina District', 'Cultural Quarter', 'Shopping District'];
    
    for (let i = 0; i < 12; i++) {
      activities.push({
        id: `activity_${Date.now()}_${i}`,
        name: this.generateActivityName(activityTypes[i % activityTypes.length]),
        type: activityTypes[i % activityTypes.length],
        location: {
          name: destinations[i % destinations.length],
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.0060 + (Math.random() - 0.5) * 0.1
        },
        duration: Math.floor(Math.random() * 120) + 30,
        cost: Math.floor(Math.random() * 100) + 20,
        time: `${8 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`,
        dayIndex: Math.floor(i / 4),
        description: 'AI-generated activity based on your preferences'
      });
    }
    
    return activities;
  }

  generateActivityName(type) {
    const names = {
      attraction: ['Historic Museum', 'Art Gallery', 'City Park', 'Observatory', 'Monument'],
      restaurant: ['Local Bistro', 'Rooftop Restaurant', 'Street Food Market', 'Fine Dining', 'Cafe'],
      activity: ['Walking Tour', 'Boat Cruise', 'Cooking Class', 'Shopping', 'Spa'],
      transport: ['Taxi Ride', 'Metro Trip', 'Bus Tour', 'Car Rental', 'Airport Transfer']
    };
    
    const typeNames = names[type] || ['Activity'];
    return typeNames[Math.floor(Math.random() * typeNames.length)];
  }

  organizeActivitiesByDay(activities, tripData) {
    const days = [];
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(tripData.endDate);
    const dayCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    for (let i = 0; i < dayCount; i++) {
      const dayActivities = activities.filter(a => a.dayIndex === i);
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      days.push({
        date: currentDate.toISOString().split('T')[0],
        activities: dayActivities,
        weather: {
          temperature: Math.floor(Math.random() * 20) + 15,
          condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
          humidity: Math.floor(Math.random() * 40) + 40
        }
      });
    }
    
    return days;
  }
}

export default new ItineraryService();