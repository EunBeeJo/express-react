import express from 'express';
import Memo from '../models/memo';
import mongoose from 'mongoose';

const router = express.Router();

/*
    WRITE Memo: POST api/memo
    BODY SAMPLE: { contents: "sample" }
    ERROR CODES:
      1: NOT LOGGED IN
      2: EMPTY CONTENTS
*/
router.post('/', (req, res) => {
  // Check Login status
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 1
    });
  }

  // Check Contents Valid
  if (typeof req.body.contents !== 'string' || req.body.contents === "") {
    return res.status(300).json({
      error: "EMPTY CONTENTS",
      code: 2
    });
  }

  // Create New Memo
  let memo = new Memo({
    writer: req.session.loginInfo.username,
    contents: req.body.contents
  });

  // Save In DB
  memo.save(err => {
    if (err) throw err;
    return res.json({ sucess: true });
  });
});

/*
    MODIFY MEMO: PUT /api/memo/:id
    BODY SAMPLE: { contents: "sampe" }
    ERROR CODES:
      1: INVALID ID.
      2: EMPTY CONTENTS,
      3: NOT LOGGED IN,
      4: NO RESOURCE,
      5: PERMISSION FAILURE
*/
router.post('/:id', (req, res) => {
  // Check Memo ID Validity
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 1
    });
  }

  // Check Content Validity
  if (typeof req.body.contents !== 'string' || req.body.contents === "") {
    return res.status(400).json({
      error: "EMPTY CONTENTS",
      code: 2
    });
  }

  // Check Login status
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 3
    });
  }

  // Find Memo
  if (memo.findById(req.params.id), (err, memo) => {
    if (err) throw err;

    // If Memo Does Not Exist
    if (!memo) {
      return res.status(404).json({
        error: "NO RESOURCE",
        code: 4
      });
    }

    // If Exist, Check Writer
    if (memo.writer != req.session.loginInfo.username) {
      return res.status(403).json({
        error: "PERMISSION FAILURE",
        code: 5
      });
    }

    // Modify And Save In DB
    memo.contents = req.body.contents;
    memo.date.edited = req.body.edited;
    memo.is_edited = req.body.is_edited;

    memo.save((err, memo) => {
      if (err) throw err;
      return res.json({
        success: true,
        memo
      });
    });
  });
});

/*
    DELETE MEMO: DELETE /api/memo/:id
    ERROR CODES:
      1: INVALID ID
      2: NOT LOGGED IN
      3: NO RESOURCE
      4: PERMISSION FAILURE
*/
router.delete('/:id', (req, res) => {
  // Check Memo Id Validity
  if (!mongoose.Types.ObjectId.isValid(req.param.id)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 1
    });
  }

  // Check Login Status
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 2
    });
  }

  // Find Memo And Check For Writer
  Memo.findById(req.params.id, (err, memo) => {
    if (err) throw err;

    if (!memo) {
      return res.status(404).json({
        error: "NO RESOURCE",
        code: 3
      });
    }

    if (memo.writer != req.session.loginInfo.username) {
      return res.status(403).json({
        error: "PERMISSION FAILURE",
        code: 4
      });
    }

    Memo.remove({ _id: req.params.id }, err => {
      if (err) throw err;
      return res.json({ success: true });
    })
  });
});

/*
  READ MEMO: GET /api/memo
*/
router.get('/', (req, res) => {
  Memo.find()
      .sort({ "_id": -1 })
      .limit(6)
      .exec((err, memos) => {
        if (err) throw err;
        res.json(memos);
      });
});

export default router;
