import budgetsData from '../mockData/budgets.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BudgetService {
  constructor() {
    this.budgets = [...budgetsData];
  }

  async getAll() {
    await delay(300);
    return [...this.budgets];
  }

  async getById(id) {
    await delay(200);
    const budget = this.budgets.find(b => b.id === id);
    return budget ? { ...budget } : null;
  }

  async getByTripId(tripId) {
    await delay(250);
    const budget = this.budgets.find(b => b.tripId === tripId);
    return budget ? { ...budget } : null;
  }

  async create(budgetData) {
    await delay(400);
    const newBudget = {
      ...budgetData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.budgets.push(newBudget);
    return { ...newBudget };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.budgets.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Budget not found');
    
    this.budgets[index] = { ...this.budgets[index], ...updates };
    return { ...this.budgets[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.budgets.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Budget not found');
    
    this.budgets.splice(index, 1);
    return true;
  }

  async calculateTotalBudget(budget) {
    await delay(200);
    const total = Object.values(budget).reduce((sum, value) => {
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
    return total;
  }
}

export default new BudgetService();