var express = require('express');
var router = express.Router();
var googleTTS = require('google-tts-api');
var https = require('https');
var fs = require('fs');

router.get('/', function (req, res, next) {
  res.send('2RED API SYSTEM');
});

/**
 * Text to mp3
 * @param text
 */
router.get('/tts/:text', function (req, res, next) {
  let text = req.params.text;

  googleTTS(text, 'vi', 1)   // speed normal = 1 (default), slow = 0.24
    .then(function (url) {
      let file = fs.createWriteStream('file.mp3');
      https.get(url, function (response) {
        let stream = response.pipe(file);
        let prefix = 'data:audio/mp3;base64,';
        stream.on('finish', function () {
          fs.readFile("file.mp3", { encoding: 'base64' }, function (err, data) {
            if (err) {
              console.log(err);
              return res.send(err);
            }
            return res.status(200).json({ base64: prefix + data });
          });
        });
      });
    })
    .catch(function (err) {
      console.error(err);
      return res.send(err);
    });
});

module.exports = router;
