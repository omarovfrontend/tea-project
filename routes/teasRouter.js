const router = require('express').Router();
const { User, Post } = require('../db/models');

// router.get('/', async (req, res) => {
//   const posts = await Post.findAll();
//   res.render({ posts }, 'teas');
// });

router.get('/', async (req, res) => {
  let posts = await Post.findAll({
    include: [{
      model: User,
    }],
    raw: true,
  });

  posts = posts.map((el) => ({
    ...el, owner: (el.user_id === req.session.userId),
  }));
  res.render('teas', { posts });
});

router.get('/get-tea', async (req, res) => {
  const posts = await Post.findAll();
  res.json(posts);
});

module.exports = router;
