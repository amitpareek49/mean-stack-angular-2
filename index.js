const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8000; 

const authentication = require('./router/authentication')(router);
const blogs = require('./router/blogs')(router);

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
	if(err) {
		console.log('Could not connect to the database: ' + err);
	} else {
		console.log('Connected to the database: ' + config.db);
	}
});

app.use(cors({ origin: 'http://localhost:4200' }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use('/authentication', authentication);
app.use('/blogs', blogs);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(port, () => {
	console.log('Listening in port '+ port);
});