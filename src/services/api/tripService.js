import tripsData from '../mockData/trips.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TripService {
  constructor() {
    this.trips = [...tripsData];
  }

  async getAll() {
    await delay(300);
    return [...this.trips];
  }

  async getById(id) {
    await delay(200);
    const trip = this.trips.find(t => t.id === id);
    return trip ? { ...trip } : null;
  }

  async create(tripData) {
    await delay(400);
    const newTrip = {
      ...tripData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'planning'
    };
    this.trips.push(newTrip);
    return { ...newTrip };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.trips.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Trip not found');
    
    this.trips[index] = { ...this.trips[index], ...updates };
    return { ...this.trips[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.trips.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Trip not found');
    
    this.trips.splice(index, 1);
    return true;
  }

  async getCurrentTrip() {
    await delay(200);
    const currentTrip = this.trips.find(t => t.status === 'active');
    return currentTrip ? { ...currentTrip } : null;
  }
}

export default new TripService();