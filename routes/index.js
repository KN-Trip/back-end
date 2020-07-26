const express = require('express');
const passport = require('passport');

const router = express.Router();

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(301).redirect('/');
  }
};

router.get('/', (req, res, next) => {
  res.send('Before Login Main');
});
router.get('/main', authenticateUser, (req, res, next) => {
  res.send('After Login Main');
});

// local sign up
router.post('/signup', passport.authenticate('local-signup', {
  failureRedirect: '/',
}), (req, res) => {
  res.send('Sign up success');
});
// local login
router.post('/login', passport.authenticate('local-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send(req.user);
  });
});

// naver 로그인
router.get('/login/naver', passport.authenticate('naver-signin'));
// naver 로그인 연동 콜백
router.get('/login/naver/callback', passport.authenticate('naver-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.redirect('http://localhost:3000');
  });
});

// kakao 로그인
router.get('/login/kakao', passport.authenticate('kakao-signin'));
// kakao 로그인 연동 콜백
router.get('/login/kakao/callback', passport.authenticate('kakao-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send(req.user);
  });
});

// logout
router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.save(() => {
    res.redirect('/');
  });
});

// Session destroy
router.get('/session-destroy', (req, res) => {
  req.session.destroy();
  res.send('Session Destroyed!');
});

module.exports = router;
