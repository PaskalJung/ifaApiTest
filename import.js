// j'importe ma lib mongoose
var mongoose = require('mongoose');
var Eleve = require('./models/eleve.js');
var srcListe = require('./data/liste.js');
// je crée mon schema


// je me connecte a la db
var promise = mongoose.connect('mongodb://localhost:27017/ifa', {
  useMongoClient: true,
});
// quand la connection est réussie
promise.then(function(db) {

	console.log('db.connected');

	srcListe.forEach(function(eleveSrc){
		console.log(eleveSrc);

		var eleveToSave = new Eleve(eleveSrc);

		eleveToSave.save(function(err, success){
			if(err){
				return console.log(err);
			}
			else{
				console.log(success);
			}
		});
	})

});
