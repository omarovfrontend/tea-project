module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const sessionAuth = req.session.userId;
    if (!sessionAuth) {
      return res.status(200).redirect('/');
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Вы не авторизованы!' });
  }
};
