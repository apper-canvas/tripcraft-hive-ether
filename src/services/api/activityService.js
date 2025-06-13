import activitiesData from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await delay(300);
    return [...this.activities];
  }

  async getById(id) {
    await delay(200);
    const activity = this.activities.find(a => a.id === id);
    return activity ? { ...activity } : null;
  }

  async getByType(type) {
    await delay(250);
    return this.activities.filter(a => a.type === type).map(a => ({ ...a }));
  }

  async create(activityData) {
    await delay(400);
    const newActivity = {
      ...activityData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Activity not found');
    
    this.activities[index] = { ...this.activities[index], ...updates };
    return { ...this.activities[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Activity not found');
    
    this.activities.splice(index, 1);
    return true;
  }

  async searchActivities(query, filters = {}) {
    await delay(400);
    let results = [...this.activities];
    
    if (query) {
      results = results.filter(a => 
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (filters.type) {
      results = results.filter(a => a.type === filters.type);
    }
    
    if (filters.maxCost) {
      results = results.filter(a => a.cost <= filters.maxCost);
    }
    
    return results;
  }
}

export default new ActivityService();