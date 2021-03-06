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
    location: req.body.location,
    category: req.body.category,
    budget: req.body.budget,
    image: req.body.image,
    owner: req.session.currentUser._id,
    status: 'Ongoing'
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
      .populate('bids.negotiations.sender')
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

router.post('/:taskId/bids/:bidId', (req, res, next) => {
  const taskId = req.params.taskId;
  const bidId = req.params.bidId;
  if (req.session.currentUser) {
    let newNegotiation = {
      sender: req.session.currentUser,
      message: req.body.message
    };

    Tasks.findById(taskId, (err, task) => {
      if (err) {
        return next(err);
      }
      let bids = task.bids;
      let index = null;

      for (let i in bids) {
        if (bids[i]._id.toString() === bidId) {
          index = i;
          break;
        }
      }

      task.bids[index].negotiations.push(newNegotiation);

      task.save(() => {
        res.json({});
      });
    });
  }
});

router.post('/:taskId/bids/:bidId/accept', (req, res, next) => {
  const taskId = req.params.taskId;
  if (req.session.currentUser) {
    let data = {
      status: req.body.status
    };
    Tasks.findByIdAndUpdate(taskId, { $set: data })
      .then(task => {
        res.json(task);
      })
      .catch(error => next(error));
  }
});

module.exports = router;
