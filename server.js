const express = require('express')
const app = express()
app.use(express.static('public'))

let port = process.env.PORT || 5001

const exphbs = require('express-handlebars')
const hbs = exphbs.create({
  extname: '.hbs.html'
});
app.engine('.hbs.html', hbs.engine)
app.set('views', __dirname + '/public')
app.set('view engine', 'hbs.html')

app.use(express.static('public'));
app.use('/geo', express.static('geometrics'));
app.use('/examples', express.static('examples'));

app.get("/geo/:name", (request, response) => {
  response.render('geo', {name: request.params.name});
});

app.get("/example/:name", (request, response) => {
  response.render('example', {name: request.params.name});
});


var listener = app.listen(port, function () {
  console.log('listening on port ' + listener.address().port);
  console.log('http://localhost:' + listener.address().port);
});
