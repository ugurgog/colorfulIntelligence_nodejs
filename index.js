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
const DB_USER = 'USER';

// Question list types
const LIST_TYPE_ACTIVE = 'ACTIVE';
const LIST_TYPE_PASSIVE = 'PASSIVE';
const LIST_TYPE_ALL = 'ALL';

admin.initializeApp();

//***************************USER FUNCTIONS ***********************************************

// https://us-central1-colorful-intelligence.cloudfunctions.net/saveUser?reqQuery={"name" : "UU","profilePhotoUrl" : "XX","createDate": "22.03.2020"}&userid=-M-6OgowiJqdmdYcccc
exports.saveUser = functions.https.onRequest(async (req, res) => {
    console.log("saveUser******************************" );
    
    try {
        const reqQuery = req.query.reqQuery;
        var userid = req.query.userid;

        var jsonResponse = JSON.parse(reqQuery);

        if (jsonResponse.status === 0) {
            return res.status(400).send(getErrorMessage(req, 'Json is not valid!'));
        } else {
            if(userid !== null && userid !== undefined){
                const snapshot = await admin.database().ref('/' + DB_USER + '/' + userid + '/').set(jsonResponse);
            }
            else{
                const snapshot = await admin.database().ref('/' + DB_USER).push(jsonResponse);
                userid = snapshot.ref.toString();
            }
        }

        var json = JSON.stringify({
            "userid":userid,
            "message":"User save successful"
        });

        return res.status(200).send(json);
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

// https://us-central1-colorful-intelligence.cloudfunctions.net/listUsers?userid=-M-6OgowiJqdmdYcccc
// https://us-central1-colorful-intelligence.cloudfunctions.net/listUsers?idList=["-M-6OgowiJqdmdYcccc", "xxx"]
exports.listUsers = functions.https.onRequest(async (req, res) => {
    console.log("listUsers******************************" );
    
    try {
        var userid = req.query.userid;
        var idList = req.query.idList;

        if(userid !== null && userid !== undefined){
            var listRef = admin.database().ref('/' + DB_USER + '/' + userid);
            var listener = listRef.on('value', snapshot => {
                listRef.off('value', listener);
                return res.status(200).send(snapshot.val());
            });
        }else if(idList !== null && idList !== undefined){

            var array = JSON.parse(idList);

            var listRefForId = admin.database().ref('/' + DB_USER);
            var listenerForId = listRefForId.on('value', snapshot =>  {
                var snapshotMap = new Map();

                snapshot.forEach(childSnapshot => {
                    var key = childSnapshot.key;
                    
                    array.every((element, index) => {
                      if (element === key) {
                        snapshotMap.set(key, childSnapshot.val());
                        return false;
                      }
                      else return true;
                    })
                });

                const myJson = {};
                myJson.snapshotMap = mapToObj(snapshotMap);
                const json = JSON.stringify(myJson);
                    
                listRefForId.off('value', listenerForId);
                return res.status(200).send(json);
            });

        }else{
            return res.status(400).send(getErrorMessage(req, 'Userid or idList is null or undefined!'));
        }
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
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
                id = snapshot.ref.toString();
            }
        }

        var json = JSON.stringify({
            "id":id,
            "message":"Question update successful"
        });

        return res.status(200).send(json);
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

// https://us-central1-colorful-intelligence.cloudfunctions.net/listQuestions?type=ALL
// https://us-central1-colorful-intelligence.cloudfunctions.net/listQuestions?idList=["-M-6_N8bWkBbZmwxSEOk","ddfdf"]
// type=ALL, type=ACTIVE, type=PASSIVE
exports.listQuestions = functions.https.onRequest(async (req, res) => {
    console.log("listQuestions******************************" );
    
    try {
        var type = req.query.type;
        var idList = req.query.idList;

        if(type !== null && type !== undefined){
            if(type !== LIST_TYPE_PASSIVE && type !== LIST_TYPE_ACTIVE && type !== LIST_TYPE_ALL){
                return res.status(400).send(getErrorMessage(req, 'List type is invalid!'));
            }else{
                var listRef = admin.database().ref('/' + DB_QUESTIONS);
                var listener = listRef.on('value', snapshot => {

                    var snapshotMap = new Map();

                    snapshot.forEach(childSnapshot => {
                          var key = childSnapshot.key;
                          var isActive = childSnapshot.val().isActive;

                          if(type === LIST_TYPE_ALL){
                            snapshotMap.set(key, childSnapshot.val());
                          }else if(type === LIST_TYPE_ACTIVE && isActive === true){
                            snapshotMap.set(key, childSnapshot.val());
                          }else if(type === LIST_TYPE_PASSIVE && isActive === false){
                            snapshotMap.set(key, childSnapshot.val());
                          }
                    });
                    const myJson = {};
                    myJson.snapshotMap = mapToObj(snapshotMap);

                    const json = JSON.stringify(myJson);
                    console.log('json:' , json);
                    
                    listRef.off('value', listener);
                    return res.status(200).send(json);
                });
            }
        }else if(idList !== null && idList !== undefined){

            var array = JSON.parse(idList);
            var listRefForId = admin.database().ref('/' + DB_QUESTIONS);
            var listenerForId = listRefForId.on('value', snapshot =>  {
                var snapshotMap = new Map();

                snapshot.forEach(childSnapshot => {
                    var key = childSnapshot.key;
                    
                    array.every((element, index) => {
                      if (element === key) {
                        snapshotMap.set(key, childSnapshot.val());
                        return false;
                      }
                      else return true;
                    })
                });

                const myJson = {};
                myJson.snapshotMap = mapToObj(snapshotMap);
                const json = JSON.stringify(myJson);
                    
                listRefForId.off('value', listenerForId);
                return res.status(200).send(json);
            });

        }else{
            return res.status(400).send(getErrorMessage(req, 'List type or idList is null or undefined!'));
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
        var jsonResponse = JSON.parse(reqQuery);

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

// https://us-central1-colorful-intelligence.cloudfunctions.net/listGames?gameId=-M-6OSOZC7j6KCoQakLT
// https://us-central1-colorful-intelligence.cloudfunctions.net/listGames?idList=["-M-6OSOZC7j6KCoQakLT", "game1"]
exports.listGames = functions.https.onRequest(async (req, res) => {
    console.log("listGames******************************" );
    
    try {
        var gameId = req.query.gameId;
        var idList = req.query.idList;

        if(gameId !== null && gameId !== undefined){
            var listRef = admin.database().ref('/' + DB_GAME + '/' + gameId);
            var listener = listRef.on('value', snapshot => {
                listRef.off('value', listener);
                return res.status(200).send(snapshot.val());
            });
        }else if(idList !== null && idList !== undefined){

            var array = JSON.parse(idList);

            var listRefForId = admin.database().ref('/' + DB_GAME);
            var listenerForId = listRefForId.on('value', snapshot =>  {
                var snapshotMap = new Map();

                snapshot.forEach(childSnapshot => {
                    var key = childSnapshot.key;
                    
                    array.every((element, index) => {
                      if (element === key) {
                        snapshotMap.set(key, childSnapshot.val());
                        return false;
                      }
                      else return true;
                    })
                });

                const myJson = {};
                myJson.snapshotMap = mapToObj(snapshotMap);
                const json = JSON.stringify(myJson);
                    
                listRefForId.off('value', listenerForId);
                return res.status(200).send(json);
            });

        }else{
            return res.status(400).send(getErrorMessage(req, 'GameId or idList is null or undefined!'));
        }
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

function mapToObj(map){
  var obj = {}
  map.forEach((v, k) => {
    obj[k] = v
  })
  return obj
}

/*function getTotalQuestionCount() {
    var ref = firebase.database().ref('QUES/');
    ref.on('value', function(snapshot) {
        console.log("snapshot.val():", snapshot.val());
    });
}*/