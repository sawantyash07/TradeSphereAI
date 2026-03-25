const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../app');
const Fund = require('../models/Fund');

let app;

beforeAll(async () => {
  // Use a test-specific DB or local memory one if available
  // Since we haven't installed memory-server successfully, we'll try to connect to a test db or mock
  const url = process.env.MONGO_URL || 'mongodb://127.0.0.1/tradesphere_test';
  await mongoose.connect(url);
  app = createApp();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Fund API Tests', () => {
  beforeEach(async () => {
    await Fund.deleteMany({});
  });

  test('GET /allFunds - fetches initial fund data', async () => {
    const response = await request(app).get('/allFunds');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('availableMargin');
    expect(response.body).toHaveProperty('availableCash');
  });

  test('POST /allFunds/deposit - adds money to account', async () => {
    const depositAmount = 5000;
    const response = await request(app)
      .post('/allFunds/deposit')
      .send({ amount: depositAmount });
    
    expect(response.status).toBe(200);
    expect(response.body.availableMargin).toBeGreaterThanOrEqual(depositAmount);
  });

  test('POST /allFunds/withdraw - subtracts money if sufficient', async () => {
    // First deposit
    await request(app).post('/allFunds/deposit').send({ amount: 10000 });
    
    const response = await request(app)
      .post('/allFunds/withdraw')
      .send({ amount: 3000 });
    
    expect(response.status).toBe(200);
  });

  test('POST /allFunds/withdraw - fails if insufficient funds', async () => {
    // Reset to small amount
    await Fund.deleteMany({});
    const baseFund = new Fund({ availableCash: 100, availableMargin: 100 });
    await baseFund.save();

    const response = await request(app)
      .post('/allFunds/withdraw')
      .send({ amount: 500 });
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Insufficient funds for withdrawal');
  });
});
