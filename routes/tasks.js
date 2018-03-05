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

router.post('/:id', (req, res, next) => {
  const id = req.params.id;
  if (req.session.currentUser) {
    let newBid = {
      bidder: req.session.currentUser,
      price: req.body.price
    };
    Tasks.findByIdAndUpdate(
      id,
      {$push: {'bids': newBid}},
      { new: true }
    )
      .then(task => {
        res.json(task);
      });
  } else {
    res.status(404).json({error: 'not-found'});
  }
});

module.exports = router;
