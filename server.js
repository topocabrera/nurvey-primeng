// //Install express server
// const express = require('express');
// const path = require('path');
//
// const app = express();
//
// // Serve only the static files form the dist directory
// app.use(express.static('./dist/nurvey'));
//
// app.get('/*', function(req,res) {
//
// res.sendFile(path.join(__dirname,'/dist/nurvey/index.html'));
// });
//
// // Start the app by listening on the default Heroku port
// app.listen(process.env.PORT || 8080);

const express = require('express');
const app = express();

// Run the app by serving the static files in the dist directory
app.use(express.static(__dirname + '/dist'));

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);