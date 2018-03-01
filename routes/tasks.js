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
  console.log(req.body);
  let newTask = new Tasks({
    title: req.body.title
  });
  newTask.save()
    .then(task => res.json(task))
    .catch(next);
});

module.exports = router;
