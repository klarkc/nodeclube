var app = require('../../app');
var request = require('supertest')(app);
var mm = require('mm');
var config = require('../../config');
var passport = require('passport');
var configMiddleware = require('../../middlewares/conf');
var should = require('should');
var UserProxy = require('../../proxy/user');
var mailService = require('../../common/mail');
var pedding = require('pedding');
var utility = require('utility');
var tools = require('../../common/tools');

describe('test/controllers/sign.test.js', function () {
  var now = +new Date();
  var loginname = 'testuser' + now;
  var email = 'testuser' + now + '@gmail.com';
  var pass = 'wtffffffffffff';

  afterEach(function () {
    mm.restore();
  });

  describe('sign up', function () {

    it('should visit sign up page', function (done) {
      request.get('/signup')
      .expect(200, function (err, res) {
        res.text.should.containEql('Confirme a sua senha');
        done(err);
      });
    });

    it('should redirect to github oauth page', function (done) {
      mm(config.GITHUB_OAUTH, 'clientID', 'clientID chenged');
      app.get('/signup_github', configMiddleware.github, passport.authenticate('github'));
      request.get('/signup_github')
      .expect(302, function (err, res) {
        res.headers.location.should.containEql('https://github.com/login/oauth/authorize?');
        done(err);
      });
    });

    it('should sign up a user', function (done) {
      done = pedding(done, 2);

      mm(mailService, 'sendMail', function (data) {
        data.to.should.match(new RegExp(loginname + '@gmail\\.com'));
        done();
      });
      request.post('/signup')
        .send({
          loginname: loginname,
          email: email,
          pass: pass,
          re_pass: pass,
        })
        .expect(200, function (err, res) {
          should.not.exists(err);
          res.text.should.containEql('Bem-vindo');
          UserProxy.getUserByLoginName(loginname, function (err, user) {
            should.not.exists(err);
            user.should.ok();
            done();
          });
        });
    });

    it('should not sign up a user when loginname is exists', function (done) {
      request.post('/signup')
        .send({
          loginname: loginname,
          email: email + '1',
          pass: pass,
          re_pass: pass,
        })
        .expect(422, done);
    });

    it('should not sign up a user when email is exists', function (done) {
      request.post('/signup')
        .send({
          loginname: loginname + '1',
          email: email,
          pass: pass,
          re_pass: pass,
        })
        .expect(422, done);
    });
  });

  describe('login in', function () {
    it('should visit sign in page', function (done) {
      request.get('/signin').end(function (err, res) {
        res.text.should.containEql('Login');
        res.text.should.containEql('Login usando GitHub');
        done(err);
      });
    });

    it('should error when no loginname or no pass', function (done) {
      request.post('/signin')
      .send({
        name: loginname,
        pass: '',
      })
      .end(function (err, res) {
        res.status.should.equal(422);
        res.text.should.containEql('Informações incompletas.');
        done(err);
      });
    });

    it('should not login in when not actived', function (done) {
      request.post('/signin')
      .send({
        name: loginname,
        pass: pass,
      })
      .end(function (err, res) {
        res.status.should.equal(403);
        res.text.should.containEql('A sua conta não está ativada, um email foi enviado para');
        done(err);
      });
    });
  });

  describe('sign out', function () {
    it('should sign out', function (done) {
      request.post('/signout')
      .set('Cookie', config.auth_cookie_name + ':something;')
      .expect(302, function (err, res) {
        res.headers['set-cookie'].should.eql([ 'gw2brreborn=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT' ]);
        done(err);
      });
    });
  });

  describe('active', function () {
    it('should active account', function (done) {
      UserProxy.getUserByLoginName(loginname, function (err, user) {
        var key = utility.md5(user.email + user.pass + config.session_secret);
        request.get('/active_account')
        .query({
          key: key,
          name: loginname,
        })
        .expect(200, function (err, res) {
          res.text.should.containEql('A conta foi ativada, por favor efetue login');
          done(err);
        });
      });
    });
  });

  describe('when new user is actived', function () {
    it('should login in successful', function (done) {
      request.post('/signin')
      .send({
        name: loginname,
        pass: pass,
      })
      .end(function (err, res) {
        res.status.should.equal(302);
        res.headers.location.should.equal('/');
        done(err);
      });
    });
  });

  describe('search pass', function () {
    var resetKey;

    it('should 200 when get /search_pass', function (done) {
      request.get('/search_pass')
      .expect(200, function (err, res) {
        res.text.should.containEql('Esqueci minha senha');
        done(err);
      });
    });

    it('should update search pass', function (done) {
      done = pedding(done, 2);
      mm(mailService, 'sendMail', function (data) {
        data.from.should.equal('Guild Wars 2 Brasil - Reborn <postmaster@mg.guildwars2brasil.com.br>');
        data.to.should.match(new RegExp(loginname));
        data.subject.should.equal('Guild Wars 2 Brasil - Reborn Recuperação de senha');
        data.html.should.match(new RegExp('<p>Olá：' + loginname));
        resetKey = data.html.match(/key=(.+?)&/)[1];
        done();
      });

      request.post('/search_pass')
      .send({
        email: email
      })
      .expect(200, function (err, res) {
        res.text.should.containEql('Um email lhe foi enviado com instruções para redefinição de senha');
        done(err);
      });
    });

    it('should 200 when get /reset_pass', function (done) {
      request.get('/reset_pass')
      .query({
        key : resetKey,
        name : loginname
      })
      .expect(200, function (err, res) {
        res.text.should.containEql('Redefinição de senha');
        done(err);
      });
    });

    it('should 403 get /reset_pass when with wrong resetKey', function (done) {
      request.get('/reset_pass')
      .query({
        key : 'wrong key',
        name : loginname
      })
      .expect(403, function (err, res) {
        res.text.should.containEql('Informação incorreta, a senha não pode ser redefinida');
        done(err);
      });
    });

    it('should update passwork', function (done) {
      request.post('/reset_pass')
      .send({
        psw: 'jkljkljkl',
        repsw: 'jkljkljkl',
        key: resetKey,
        name: loginname,
      })
      .expect(200, function (err, res) {
        res.text.should.containEql('A sua senha foi redefinida');
        done(err);
      })
    })
  });
});
