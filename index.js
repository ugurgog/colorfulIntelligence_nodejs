const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');

// Firebase Db names
const DB_QUESTIONS = 'QUESTIONS';
const DB_GAME = 'GAME';

// Question list types
const LIST_TYPE_ACTIVE = 'ACTIVE';
const LIST_TYPE_PASSIVE = 'PASSIVE';
const LIST_TYPE_ALL = 'ALL';

admin.initializeApp();


//  https://us-central1-colorful-intelligence.cloudfunctions.net/addMessage?text=uppercaseme
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    const snapshot = await admin.database().ref('/messages').push({ original: original });
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref.toString());
});

//***************************QUESTION FUNCTIONS ***********************************************

// https://us-central1-colorful-intelligence.cloudfunctions.net/saveQuestion?reqQuery={"question" : "xxxxx","answer" : "xxxxx","isActive": true}
// https://us-central1-colorful-intelligence.cloudfunctions.net/saveQuestion?reqQuery={"question" : "xxxxx","answer" : "xxxxx","isActive": true}&id=-M-6OgowiJqdmdYeO5_t

exports.saveQuestion = functions.https.onRequest(async (req, res) => {
    console.log("saveQuestion******************************" );
    
    try {
    	const reqQuery = req.query.reqQuery;
    	var id = req.query.id;

		var jsonResponse = JSON.parse(reqQuery);

		if (jsonResponse.status === 0) {
    		return res.status(400).send(getErrorMessage(req, 'Json is not valid!'));
    	} else {
    		if(id !== null && id !== undefined){
    			const snapshot = await admin.database().ref('/' + DB_QUESTIONS + '/' + id + '/').set(jsonResponse);
    		}
    		else{
    			const snapshot = await admin.database().ref('/' + DB_QUESTIONS).push(jsonResponse);
    		}
    	}

	    return res.status(200).send('Question update successful');
  } catch (error) {
    	return res.status(400).send(getErrorMessage(req, error));
  }
});

// https://us-central1-colorful-intelligence.cloudfunctions.net/listQuestions?type=ALL
exports.listQuestions = functions.https.onRequest(async (req, res) => {
    console.log("listQuestions******************************" );
    
    try {
    	var type = req.query.type;

    	if(type !== null && type !== undefined){
    		if(type !== LIST_TYPE_PASSIVE && type !== LIST_TYPE_ACTIVE && type !== LIST_TYPE_ALL){
    			return res.status(400).send(getErrorMessage(req, 'List type is invalid!'));
    		}else{
    			var listRef = admin.database().ref('/' + DB_QUESTIONS);
    			var listener = listRef.on('value', function(snapshot) {

					console.log('snapshot.val():' , snapshot.val());
  					console.log('snapshot.key  :' , snapshot.key);

    				var snapshotMap = new Map();

    				snapshot.forEach(function(childSnapshot) {
					      var key = childSnapshot.key;
					      var isActive = childSnapshot.val().isActive;

					      console.log('--->key:' , key);
					      console.log('--->val:' , childSnapshot.val());
					      
					      if(type === LIST_TYPE_ALL){
					      	snapshotMap.set(key, childSnapshot.val());
					      }else if(type === LIST_TYPE_ACTIVE && isActive === true){
					      	snapshotMap.set(key, childSnapshot.val());
					      }else if(type === LIST_TYPE_PASSIVE && isActive === false){
					      	snapshotMap.set(key, childSnapshot.val());
					      }
					});
    				console.log('snapshotMap:' , snapshotMap);
  					
					listRef.off('value', listener);
					return res.status(200).send(snapshotMap);
				});
    		}
    	}else{
    		return res.status(400).send(getErrorMessage(req, 'List type is null or undefined!'));
    	}
  } catch (error) {
    	return res.status(400).send(getErrorMessage(req, error));
  }
});

//***************************GAME FUNCTIONS ***********************************************

// https://us-central1-colorful-intelligence.cloudfunctions.net/saveGame?reqQuery={"endTime" : "22.03.2020","gameName" : "oyun1","totalQuestionCount": 30, "questionList":[1,2,3],"statusId":1}
// https://us-central1-colorful-intelligence.cloudfunctions.net/saveGame?reqQuery={"endTime" : "22.03.2020","gameName" : "oyun1","totalQuestionCount": 30, "questionList":[1,2,3],"statusId":1}&id=-M-6OSOZC7j6KCoQakLT
exports.saveGame = functions.https.onRequest(async (req, res) => {
    console.log("addGame******************************" );
    
    try {
    	const reqQuery = req.query.reqQuery;

    	var id = req.query.id;

		console.log("reqQuery:" , reqQuery);
    	console.log("id:" , id);

    	var jsonResponse = JSON.parse(reqQuery);

    	console.log("jsonResponse:" , jsonResponse);

    	if (jsonResponse.status === 0) {
    		return res.status(400).send(getErrorMessage(req, 'Json is not valid!'));
    	} else {
    		if(id !== null && id !== undefined){
    			const snapshot = await admin.database().ref('/' + DB_GAME + '/' + id + '/').set(jsonResponse);
    		}
    		else{
    			const snapshot = await admin.database().ref('/' + DB_GAME).push(jsonResponse);
    		}
    	}

	    return res.status(200).send('Game update successful');
  } catch (error) {
    	return res.status(400).send(getErrorMessage(req, error));
  }
});


//***************************CUSTOM FUNCTIONS ***********************************************

function getErrorMessage(req, error){
	var json = JSON.stringify({
  		"request":req.query,
  		"message":error.message
  	});
	return json;
}

/*function getTotalQuestionCount() {
	var ref = firebase.database().ref('QUES/');
	ref.on('value', function(snapshot) {
  		console.log("snapshot.val():", snapshot.val());
	});
}*/