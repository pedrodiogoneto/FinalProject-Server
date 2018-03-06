const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/illdoit');

const Tasks = require('../models/tasks');
const User = require('../models/user');

const tasks = [
  {
    owner: '5a9591f2cc308136fad6420c',
    title: 'Iron my shirts',
    bids: [{
      bidder: '5a9591f2cc308136fad6420d',
      price: 20,
      negotiations: [{
        sender: '5a9591f2cc308136fad6420d',
        message: 'a really nice message to get the task!!'
      }]
    }]
  },
  {
    owner: '5a9591f2cc308136fad6420c',
    title: 'write my master thesis',
    bids: [{
      bidder: '5a9591f2cc308136fad6420d',
      price: 500,
      negotiations: [{
        sender: '5a9591f2cc308136fad6420d',
        message: 'I need the moneyyyy!'
      }]
    }]
  }
];

let promises = tasks.map(tasks => {
  return User.findOne({user: tasks.user})
    .then(user => {
      if (!user) {
        throw new Error(`User "${tasks.owner}" was not found!`);
      }
      tasks.owner = user._id;
    });
});

Promise.all(promises)
  .then(() => Tasks.remove())
  .then(() => Tasks.create(tasks))
  .then(tasks => {
    console.log(`created ${tasks.length} tasks`);
    mongoose.disconnect();
  });
