const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then((user) => res.json(user)) // brackets?
    .catch(next);
});

module.exports = router;
