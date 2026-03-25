const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../app');
const Order = require('../models/Order');

let app;

beforeAll(async () => {
  const url = process.env.MONGO_URL || 'mongodb://127.0.0.1/tradesphere_test';
  await mongoose.connect(url);
  app = createApp();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Order API Tests', () => {
  beforeEach(async () => {
    await Order.deleteMany({});
  });

  test('POST /allOrders/new - places a valid order', async () => {
    const orderData = {
      name: 'Test Logic',
      symbol: 'TEST',
      qty: 10,
      price: 150.5,
      mode: 'BUY'
    };

    const response = await request(app)
      .post('/allOrders/new')
      .send(orderData);
    
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.symbol).toBe('TEST');
  });

  test('POST /allOrders/new - fails with missing fields', async () => {
    const response = await request(app)
      .post('/allOrders/new')
      .send({ symbol: 'AAPL' });
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('All fields are required');
  });
});
