const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const fs = require('fs');

const { users } = require('./models');

const authConfig = JSON.parse(fs.readFileSync(`${__dirname}/config/federated.json`, 'utf8'));

module.exports = () => {
  passport.serializeUser((user, done) => { // Strategy 성공 시 호출
    console.log('세션에 기록하기');
    done(null, user); // 여기의 user 가 deserializeUser 의 첫 번째 매개 변수로 이동
  });

  passport.deserializeUser((user, done) => { // 매개변수 user 는 serializeUser의 done의 인자 user를 받은 것
    console.log('세션에서 사용자 정보 읽기');
    done(null, user);
  });

  passport.use('local-signup', new LocalStrategy({ // local 전략 세움
    usernameField: 'id',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  }, (req, id, password, done) => {
    const generateHash = (pw) => bcrypt.hashSync(pw, bcrypt.genSaltSync(8), null);
    users.findOne({
      where: {
        memID: id,
        socialType: 'local',
      },
    }).then((user) => {
      if (user) {
        return done(null, false, {
          message: 'ID already exists',
        });
      }
      const userPassword = generateHash(password);
      const data = {
        nickname: req.body.nickname,
        memID: id,
        memPW: userPassword,
        socialType: 'local',
      };
      users.create(data).then((newUser) => {
        if (!newUser) {
          return done(null, false);
        }
        return done(null, newUser);
      });
    });
  }));

  // Local Sign-in
  passport.use('local-signin', new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
    session: true,
    passReqToCallback: false,
  }, (id, password, done) => {
    const isValidPassword = (userPass, pw) => bcrypt.compareSync(pw, userPass);
    users.findOne({
      where: {
        memID: id,
        socialType: 'local',
      },
    }).then((sqlResult) => {
      if (!sqlResult) {
        return done(null, false, {
          message: 'ID does not exist',
        });
      }
      const userInfo = sqlResult.get();
      if (!isValidPassword(userInfo.memPW, password)) {
        return done(null, false, {
          message: 'Incorrect password',
        });
      }
      return done(null, userInfo);
    }).catch((err) => {
      console.error(err.message);
      return done(null, false, {
        message: 'Something went wrong with your sign in',
      });
    });
  }));

  // accessToken: OAuth token 이용해 오픈 API 호출
  // refreshToken: token 만료됐을 때 재발급 요청
  // profile: 사용자 정보
  // naver sign in
  passport.use('naver-signin', new NaverStrategy({
    clientID: authConfig.naver.clientID,
    clientSecret: authConfig.naver.clientSecret,
    callbackURL: authConfig.naver.callbackURL,
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    const _profile = profile._json;

    loginByThirdparty({
      auth_type: 'naver',
      auth_id: _profile.id,
    }, done);
  }));

  // kakao sing in
  passport.use('kakao-signin', new KakaoStrategy({
    clientID: authConfig.kakao.clientID,
    callbackURL: authConfig.kakao.callbackURL,
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    const _profile = profile._json;

    loginByThirdparty({
      auth_type: 'kakao',
      auth_id: _profile.id,
      auth_name: _profile.properties.nickname,
      auth_email: _profile.id,
    }, done);
  }));
};

async function loginByThirdparty(info, done) {
  console.log(`process: ${info.auth_type}`);
  const sqlResult = await users.findOne({
    where: {
      memID: info.auth_id,
      socialType: info.auth_type,
    },
  });
  if (sqlResult) {
    console.log('Old User'); // 기존 유저 로그인 처리
    done(null, {
      user_id: sqlResult.dataValues.memID,
      nickname: sqlResult.dataValues.nickname,
    });
  } else { // 신규 유저 회원 가입
    await users.create({
      memID: info.auth_id,
      socialType: info.auth_type,
    });
    done(null, {
      user_id: info.auth_id,
      nickname: info.nickname,
    });
  }
}