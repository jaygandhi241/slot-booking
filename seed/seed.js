const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const users = [
  {
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'Admin'
  },
  {
    name: 'jay gandhi',
    email: 'jaygandhi@example.com',
    password: 'user123',
    role: 'User'
  },
  {
    name: 'devstree',
    email: 'devstree@example.com',
    password: 'user123',
    role: 'User'
  },
  {
    name: 'User',
    email: 'user3@example.com',
    password: 'user123',
    role: 'User'
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await User.deleteMany({});
  for (let user of users) {
    const hashed = await bcrypt.hash(user.password, 10);
    user.password = hashed;
    await User.create(user);
  }
  console.log('Seed data inserted');
  mongoose.disconnect();
}

seed(); 