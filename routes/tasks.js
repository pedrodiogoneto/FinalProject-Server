const express = require('express');
const router = express.Router();

const Tasks = require('../models/tasks');

router.get('/', (req, res, next) => {
  Tasks.find({})
    .populate('owner')
    .populate('bids.bidder')
    .then(tasks => res.json(tasks))
    .catch(next);
});

router.post('/', (req, res, next) => {
  console.log(req.session.currentUser._id);
  let newTask = new Tasks({
    title: req.body.title,
    owner: req.session.currentUser._id
  });
  newTask.save()
    .then(task => res.json(task))
    .catch(next);
});

router.get('/user/:id', (req, res, next) => {
  const id = req.params.id;
  Tasks.find({ 'owner': id })
    .populate('owner')
    .populate('bids.bidder')
    .then(tasks => res.json(tasks))
    .catch(next);
  console.log(this.tasks);
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  if (req.session.currentUser) {
    Tasks.findById(id)
      .populate('owner')
      .populate('bids.bidder')
      .then((task) => res.json(task))
      .catch(next);
  } else {
    res.status(404).json({error: 'not-found'});
  }
});

module.exports = router;
