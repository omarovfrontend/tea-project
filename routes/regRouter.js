const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const loginMiddleware = require('../middleware/loginMiddleware');

// SIGN UP
router.get('/signup', loginMiddleware, (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 5);

  try {
    const [user, created] = await User.findOrCreate({
      where: {
        email: req.body.email,
      },
      defaults: {
        email, name, password: hash, // создает пользователя - если такого не сущ-ет
      },
    });

    if (!created) {
      res.redirect('signup');
    } else {
      req.session.userId = user.id;
      req.session.email = user.email;
      req.session.name = user.name;
      res.redirect('/');
    }
  } catch (error) {
    res.status(500);
  }
});

// SIGN IN
router.get('/signin', async (req, res) => {
  res.render('signin');
});

router.post('/signin', async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    const passwordMatch = await bcrypt.compare(password, user?.password);
    if (passwordMatch) {
      req.session.userId = user.id; // запихиваем в сессию
      req.session.email = user.email;
      req.session.name = user.name;
      res.redirect('/');
    } else {
      res.send('Упппссс, не удается найти такого пользователя!');
    }
  } catch (error) {
    res.send('Хммм, а нет такого пользователя!');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(); // удаляет сессию
  res.clearCookie('OS');
  res.redirect('signin');
});

module.exports = router;
