const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  if (req.session.currentUser) {
    User.findById(id)
      .then((user) => res.json(user)) // brackets?
      .catch(next);
  } else {
    res.status(404).json({error: 'not-found'});
  }
});

module.exports = router;
