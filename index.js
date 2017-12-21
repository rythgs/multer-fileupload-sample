const express = require('express');
const multer = require('multer');

const app = express();

const fileFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|gif|png)$/)) {
    return cb(new Error('invalid ext!'), false);
  }
  cb(null, true);
};

// ---------------------------------------------
// 通常パターン
//
// ファイル名はランダム文字列となり上書きは考慮しなくて良い。
// アップロードディレクトリがなくても作られる。
// ---------------------------------------------

const upload = multer({ dest: './upload', fileFilter: fileFilter }).array('img', 12);

app.post('/api/images/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json(err.message).end();
    }
    console.log(req.files);
    return res.status(204).end();
  });
});

// ---------------------------------------------
// diskStorage 定義パターン
//
// ファイル名はオリジナルファイル名となり、
// 同一のファイルがある場合は上書きされる。
// アップロードディレクトリがないとエラーとなる。
// ---------------------------------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload2');
  },
  filename: function (req, file, cb) {
    // ファイル名はオリジナルファイル名にする
    cb(null, file.originalname);
  }
});

const upload2 = multer({ storage: storage, fileFilter: fileFilter }).array('img', 12);

app.post('/api/images/upload2', (req, res) => {
  upload2(req, res, (err) => {
    if (err) {
      return res.json(err.message).end();
    }
    console.log(req.files);
    return res.status(204).end();
  });
});



app.listen(3000, function () {
  console.log('listening on port 3000!');
});