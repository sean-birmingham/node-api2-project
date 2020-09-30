const e = require('express');
const express = require('express');
const db = require('../data/db');

const router = express.Router();

router.get('/', (req, res) => {
  db.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved' });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist' });
    }
  });
});

router.get('/:id/comments', (req, res) => {
  const { id } = req.params;

  db.findPostComments(id)
    .then((comments) => {
      if (comments) {
        res.status(200).json(comments);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: 'The comments information could not be retrieved' });
    });
});

router.post('/', (req, res) => {
  const data = req.body;

  if (data.title && data.contents) {
    db.insert(data)
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          errorMessage:
            'There was an error while saving the post to the database'
        });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: 'Please provide title and contents for the post' });
  }
});

module.exports = router;
