var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var NodeWebcam = require("node-webcam");
var fs = require('fs');
var Jimp = require('jimp');
var express = require('express');
 
 
var app = express();

//Set View Engine
app.set('view engine', 'ejs');
app.set('views',__dirname+"/public/views");

//Allow loading of static files from 'public' folder
app.use(express.static(__dirname + '/public'));

//Get requests
app.get('/', function (req, res) {

  var food;
  var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    iam_apikey: 'aJwt6-wnUz84GaZeC1PBxqy9MWqpuF4YHdzovjDtwZjv'
  });

  var Webcam = NodeWebcam.create({});
  NodeWebcam.capture("source_pic", {}, function(err, data){
    Jimp.read('source_pic.bmp', (err, image) => {
      if (err) throw err;
      image
        .write('changed_pic.jpg');
        const moveFile = require('move-file');
        (async()=>{
          await moveFile('changed_pic.jpg','public/changed_pic.jpg');
          console.log('File moved');
          var images_file = fs.createReadStream('public/changed_pic.jpg');
          var classifier_ids = ["food"];
          var params = {
            images_file: images_file,
            classifier_ids: classifier_ids
          };
          visualRecognition.classify(params, function(err, response) {
            if (err)
              console.log(err);
            else
              food = JSON.stringify(response.images[0].classifiers[0].classes[0].class);
              //Response object uses engine to render EJS file 'index'
              res.render('index', {
                errors: null,
                food: food
              });
              console.log('Response successful');
          });
        })();
    });
    if(!err) console.log("Image created");
  });
});

//App listens to port 800 of localhost
app.listen(800, function (req, res) {
  console.log('Server started');
});