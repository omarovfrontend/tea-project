const router = require('express').Router();
const { Post } = require('../db/models');

router.get('/tea', (req, res) => {
  res.render('main');
})
  .post('/add', async (req, res) => {
    const {
      postName, location, img, description,
    } = req.body; // получили данные из body

    try {
      const newPost = await Post.create(
        {
          title: postName,
          location,
          img,
          description,
          user_id: req.session.userId,
        },
      );
      res.json(newPost.dataValues);
    } catch (error) {
      res.send('Упппссс, ошибка!');
    }
  });

// ручка для удаления поста - через fetch
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  await Post.destroy({
    where: {
      id,
    },
  });
  res.json({ isUpdatedSuccessful: true });
});

module.exports = router;
