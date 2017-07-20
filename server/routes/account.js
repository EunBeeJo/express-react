import express from 'express'
import Account from '../models/account';

const router = express.Router();

/*
    ACCOUNT SIGNUP: POST /api/account/SIGNUP
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
      1: BAD username
      2: BAD password
      3: username EXISTS
*/

router.post('/signup', (req, res) => {
  // Check username format
  let usernameRegex = /^[a-z0-9]+$/;

  if (!usernameRegex.test(req.body.username)) {
    return res.status(400).json({
      error: "BAD USERNAME",
      code: 1
    });
  }

  // Check pass length
  if (req.body.username.length < 4 || typeof req.body.password !== "string") {
    return res.status(400).json({
      error: "BAD PASSWORD",
      code: 2
    });
  }

  // Check user existance
  Account.findOne({ username: req.body.username }, (err, exists) => {
    if (err) throw err;
    if (exists) {
      return res.status(409).json({
        error: "USERNAME EXISTS",
        code: 3
      });
    }

    // Create account
    let account = new Account({
      username: req.body.username,
      password: req.body.password
    });
    account.password = account.generateHash(account.password);

    // SAVE IN THE DB
    account.save( err => {
      if (err) throw err;
      return res.json({ sucess: true });
    });
  };)
});


/*
    ACCOUNT SIGNIN: POST /api/account/SIGNIN
    BODY SAPMLE: {"username": "test", "password": "test"}
    ERROR CODES:
      1: LOGIN FAILED
*/
router.post('/signin', (req, res) => {
  if (typeof req.body.password !== "string") {
    return res.status(401).json({
      error: "LOGIN FAILED",
      code: 1
    });
  }

  // FIND THE USER BY USERNAME
  Account.findOne({ username: req.body.username }, (err, account) => {
    if (err) throw err;

    // Check Account existancy
    if (!account) {
      return res.status(401).json({
        error: "LOGIN FAILED",
        code: 1
      });
    }

    // Alter session
    let session = req.session;
    session.loginInfo = {
      _id: account._id,
      username: account.username
    };

    // Return Success
    return res.json({
      success: true;
    });
  });
});


/*
    GET CURRENT USER INFO: GET /api/account/getinfo
*/
router.get('/getinfo', (req, res) => {
  if (typeof req.session.loginInfo === "undefined") {
    return res.status(401).json({
      error: 1
    });
  }

  res.json({ info: req.session.loginInfo });
});


/*
    LOGOUT: POST /api/account/logout
*/
router.post('/logout', (req, res) => {
  req.session.destroy(err => { if (err) throw err; });
  return res.json({ success: true });
});

export default router;
