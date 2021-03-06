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

  console.log(req.session.loginInfo.username + ": " + req.body.contents);
  // Save In DB
  memo.save(err => {
    if (err) throw err;
    return res.json({ success: true });
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
router.put('/:id', (req, res) => {
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
  Memo.findById(req.params.id, (err, memo) => {
    if (err) throw err;

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

    // MODIFY AND SAVE IN DB
    memo.contents = req.body.contents;
    memo.date.edited = new Date();
    memo.is_edited = true;

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
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
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
        console.log(memos[0].contents);
        res.json(memos);
      });
});

/*
  READ ADDITIONAL (OLD/NEW) MEMO: GET /api/memo/:listType/:id
*/
router.get('/:listType/:id', (req, res) => {
  let listType = req.params.listType;
  let id = req.params.id;

  // CHECK LIST TYPE VALIDITY
  if (listType !== 'old' && listType !== 'new') {
    return res.status(400).json({
      error: "INVALID LISTTYPE",
      code: 1
    });
  }

  // CHECK MEMO ID VALIDITY
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 2
    });
  }

  let objId = new mongoose.Types.ObjectId(req.params.id);

  if (listType === 'new') {
    // GET NEWER MEMO
    Memo.find({ _id: { $gt: objId}})
    .sort({_id: -1})
    .limit(6)
    .exec((err, memos) => {
      if (err) throw err;
      return res.json(memos);
    });
  } else {
    // GET OLDER MEMO
    Memo.find({ _id: { $lt: objId }})
    .sort({_id: -1})
    .limit(6)
    .exec((err, memos) => {
      if(err) throw err;
      return res.json(memos);
    });
  }
});

export default router;
