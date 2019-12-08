var express = require('express');
var app = express();
app.use(express.static('public'));

let port = process.env.PORT || 5001

app.use(express.static('public'));
app.use(express.static('g'));
app.use(express.static('node_modules/p5/lib'));
app.use(express.static('node_modules/p5/lib/addons'));
app.use(express.static('node_modules/dat.gui/build'));


var listener = app.listen(port, function () {
  console.log('listening on port ' + listener.address().port);
  console.log('http://localhost:' + listener.address().port);
});
