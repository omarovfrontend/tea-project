const express = require('express');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const morgan = require('morgan');
const authMiddleware = require('./middleware/authMiddleware');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT ?? 3000;

// import routers
const teasRouter = require('./routes/teasRouter');
const mainRouter = require('./routes/mainRouter');
const postsRouter = require('./routes/postsRouter');
const regRouter = require('./routes/regRouter');

app.set('view engine', 'hbs');
app.set('views', path.resolve(process.env.PWD, 'views'));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(process.env.PWD, 'public')));

app.use(session({
  secret: 'TEA',
  store: new FileStore(),
  resave: false,
  saveUninitialized: false,
  name: 'OS',
  cookie: { httpOnly: true },
}));

app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  res.locals.name = req.session?.name;
  next();
}); // создает локальную переменную, которая сущ-ет если польз-ль залогинин

// on routers
app.use('/', teasRouter);
app.use('/create', authMiddleware, postsRouter);
// app.use('/post', authMiddleware, postsRouter);
app.use('/user', regRouter);

app.listen(PORT, () => {
  console.log('Server start on PORT', PORT);
});
