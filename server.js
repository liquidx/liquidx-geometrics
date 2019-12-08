var express = require('express');

var app = express();
app.use(express.static('public'));

var listener = app.listen(process.env.PORT, function () {
  console.log('liquidxnet listening on port ' + listener.address().port);
  console.log('http://localhost:' + listener.address().port);
});
