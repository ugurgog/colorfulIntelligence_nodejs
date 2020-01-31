const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
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

// https://us-central1-colorful-intelligence.cloudfunctions.net/addQuestion?question=xxx&answer=xxxx&id=2
exports.addQuestion = functions.https.onRequest(async (req, res) => {
    console.log("addQuestion******************************" );
    
    try {
		const question = req.query.question;
	    const answer = req.query.answer;
	    const quesId = req.query.id;

	    console.log("question:" , question);
	    console.log("answer  :" , answer);
	    console.log("quesId  :" , quesId);

	    
	    //getTotalQuestionCount();
	    
	    console.log("quesCount  :" , quesCount);

	    const ques = {
	    	"answer" : answer,
	    	"question" : question
	  	} 

	    // Push the new message into the Realtime Database using the Firebase Admin SDK.
	    const snapshot = await admin.database().ref('/QUES/' + quesId + '/').set(ques);

	    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
	    //res.redirect(303, snapshot.ref.toString());

	    return res.status(200).send('Question insert ok');
  } catch (error) {
  		/*var retVal = "error" :{
  			"status" : 400,
  			"req" : req,
  			"message": error.message
  		}*/
  		console.log("req body  :", req.body)
  		console.log("req query :", req.query)
  		console.log("req params:", req.params)
    	return res.status(400).send(req.body + " - " + error.message);
  }
});


/*function getTotalQuestionCount() {
	var ref = firebase.database().ref('QUES/');

	ref.on('value', function(snapshot) {
  		console.log("snapshot.val():", snapshot.val());
	});
}*/



