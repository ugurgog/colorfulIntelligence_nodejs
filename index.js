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
const DB_GAME_WINNERS = 'GAME_WINNERS';
const DB_GAME_GIFTS = 'GAME_GIFTS';
const DB_USER = 'USER';
const DB_USER_DETAIL = 'USER_DETAIL';
const DB_USER_GAMES = 'USER_GAMES';
const DB_DEVICE_TOKEN = 'DEVICE_TOKEN';

// Question list types
const LIST_TYPE_ACTIVE = 'ACTIVE';
const LIST_TYPE_PASSIVE = 'PASSIVE';
const LIST_TYPE_ALL = 'ALL';

//user Games win or lose types
const USER_GAME_TYPE_ALL = 'ALL';
const USER_GAME_TYPE_WIN = 'WIN';
const USER_GAME_TYPE_LOSE = 'LOSE';

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
                const snapshot = await admin.database().ref('/' + DB_USER + '/' + userid + '/').update(jsonResponse);
            }
            else{
                const snapshot = await admin.database().ref('/' + DB_USER).push(jsonResponse);
                userid = snapshot.ref.toString();
            }
        }

        var json = JSON.stringify({
            "id":userid,
            "message":"User save successful"
        });

        return res.status(200).send(json);
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

// https://us-central1-colorful-intelligence.cloudfunctions.net/listUsers?userid=-M-6OgowiJqdmdYcccc
// https://us-central1-colorful-intelligence.cloudfunctions.net/listUsers?userIdList=["-M-6OgowiJqdmdYcccc", "xxx"]
exports.listUsers = functions.https.onRequest(async (req, res) => {
    console.log("listUsers******************************" );
    
    try {
        var userid = req.query.userid;
        var idList = req.query.userIdList;

        if(userid !== null && userid !== undefined){
            var listRef = admin.database().ref('/' + DB_USER + '/' + userid);
            var listener = listRef.on('value', snapshot => {
                listRef.off('value', listener);
                const json = {[snapshot.key] : snapshot};
                return res.status(200).send(json);
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
                listRefForId.off('value', listenerForId);
                return res.status(200).send(getJSONFromMap(snapshotMap));
            });

        }else{
            return res.status(400).send(getErrorMessage(req, 'Userid or idList is null or undefined!'));
        }
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

//***************************USER DETAIL FUNCTIONS ***********************************************

// https://us-central1-colorful-intelligence.cloudfunctions.net/saveUserDetail?reqQuery={"currentColorCode" : "FF4563","currentColorName" : "Spring Green"}&userid=-M-6OgowiJqdmdYcccc
exports.saveUserDetail = functions.https.onRequest(async (req, res) => {
    console.log("saveUserDetail******************************" );
    
    try {
        const reqQuery = req.query.reqQuery;
        var userid = req.query.userid;

        var jsonResponse = JSON.parse(reqQuery);

        if (jsonResponse.status === 0) {
            return res.status(400).send(getErrorMessage(req, 'Json is not valid!'));
        } else {
            if(userid !== null && userid !== undefined){
                const snapshot = await admin.database().ref('/' + DB_USER_DETAIL + '/' + userid + '/').update(jsonResponse);
            }
            else{
                const snapshot = await admin.database().ref('/' + DB_USER_DETAIL).push(jsonResponse);
                userid = snapshot.ref.toString();
            }
        }

        var json = JSON.stringify({
            "id":userid,
            "message":"User Detail saved successful"
        });

        return res.status(200).send(json);
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

// https://us-central1-colorful-intelligence.cloudfunctions.net/listUserDetails?userid=-M-6OgowiJqdmdYcccc
// https://us-central1-colorful-intelligence.cloudfunctions.net/listUserDetails?userIdList=["-M-6OgowiJqdmdYcccc", "xxx"]
exports.listUserDetails = functions.https.onRequest(async (req, res) => {
    console.log("listUsers******************************" );
    
    try {
        var userid = req.query.userid;
        var idList = req.query.userIdList;

        if(userid !== null && userid !== undefined){
            var listRef = admin.database().ref('/' + DB_USER_DETAIL + '/' + userid);
            var listener = listRef.on('value', snapshot => {
                listRef.off('value', listener);
                const json = {[snapshot.key] : snapshot};
                return res.status(200).send(json);
            });
        }else if(idList !== null && idList !== undefined){

            var array = JSON.parse(idList);

            var listRefForId = admin.database().ref('/' + DB_USER_DETAIL);
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
                listRefForId.off('value', listenerForId);
                return res.status(200).send(getJSONFromMap(snapshotMap));
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
                const snapshot = await admin.database().ref('/' + DB_QUESTIONS + '/' + id + '/').update(jsonResponse);
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
// https://us-central1-colorful-intelligence.cloudfunctions.net/listQuestions?questionIdList=["-M-6_N8bWkBbZmwxSEOk","ddfdf"]
// type=ALL, type=ACTIVE, type=PASSIVE
exports.listQuestions = functions.https.onRequest(async (req, res) => {
    console.log("listQuestions******************************" );
    
    try {
        var type = req.query.type;
        var idList = req.query.questionIdList;

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
                    listRef.off('value', listener);
                    return res.status(200).send(getJSONFromMap(snapshotMap));
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
                listRefForId.off('value', listenerForId);
                return res.status(200).send(getJSONFromMap(snapshotMap));
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
    console.log("saveGame******************************" );
    
    try {
        const reqQuery = req.query.reqQuery;
        var id = req.query.id;
        var jsonResponse = JSON.parse(reqQuery);

        if (jsonResponse.status === 0) {
            return res.status(400).send(getErrorMessage(req, 'Json is not valid!'));
        } else {
            if(id !== null && id !== undefined){
                const snapshot = await admin.database().ref('/' + DB_GAME + '/' + id + '/').update(jsonResponse);
            }
            else{
                const snapshot = await admin.database().ref('/' + DB_GAME).push(jsonResponse);
                id = snapshot.ref.toString();
            }

            var json = JSON.stringify({
               "id":id,
               "message":"Game update successful"
            });
        }
        return res.status(200).send(json);
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

// https://us-central1-colorful-intelligence.cloudfunctions.net/listGames?gameId=-M-6OSOZC7j6KCoQakLT
// https://us-central1-colorful-intelligence.cloudfunctions.net/listGames?gameIdList=["-M-6OSOZC7j6KCoQakLT", "game1"]
// https://us-central1-colorful-intelligence.cloudfunctions.net/listGames?type=ALL
// type=ALL, type=ACTIVE, type=PASSIVE
exports.listGames = functions.https.onRequest(async (req, res) => {
    console.log("listGames******************************" );
    
    try {
        var gameId = req.query.gameId;
        var idList = req.query.gameIdList;
        var type = req.query.type;

        if(gameId !== null && gameId !== undefined){
            var listRefGame = admin.database().ref('/' + DB_GAME + '/' + gameId);
            var listenerGame = listRefGame.on('value', snapshot => {
                listRefGame.off('value', listenerGame);
                const json = {[snapshot.key] : snapshot};
                return res.status(200).send(json);
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
                listRefForId.off('value', listenerForId);
                return res.status(200).send(getJSONFromMap(snapshotMap));
            });

        }else if(type !== null && type !== undefined){
            if(type !== LIST_TYPE_PASSIVE && type !== LIST_TYPE_ACTIVE && type !== LIST_TYPE_ALL){
                return res.status(400).send(getErrorMessage(req, 'List type is invalid!'));
            }else{
                var listRef = admin.database().ref('/' + DB_GAME);
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
                    listRef.off('value', listener);
                    return res.status(200).send(getJSONFromMap(snapshotMap));
                });
            }
           
        }else{
            return res.status(400).send(getErrorMessage(req, 'GameId, idList or list type is null or undefined!'));
        }
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

//***************************GAME WINNERS FUNCTIONS ***********************************************

// https://us-central1-colorful-intelligence.cloudfunctions.net/saveGameWinner?gameId=-M-6OSOZC7j6KCcccc&userId=userxxx&reqQuery={"gameName":"game2","score":80,"giftId":2}
exports.saveGameWinner = functions.https.onRequest(async (req, res) => {
    console.log("addGame******************************" );
    
    try {
        var reqQuery = req.query.reqQuery;
        var gameId = req.query.gameId;
        var userId = req.query.userId;

        var jsonResponse = JSON.parse(reqQuery);

        if (jsonResponse.status === 0) {
            return res.status(400).send(getErrorMessage(req, 'Json is not valid!'));
        } else {
            if((userId !== null && userId !== undefined) && (gameId !== null && gameId !== undefined)){
                const snapshot = await admin.database().ref('/' + DB_GAME_WINNERS + '/' + gameId + '/' + userId).update(jsonResponse);
            }
            else{
                return res.status(400).send(getErrorMessage(req, 'GameId or UserId is not valid!'));
            }
        }

        return res.status(200).send('Game Winners update successful');
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

// https://us-central1-colorful-intelligence.cloudfunctions.net/listGameWinners?gameId=-M-6OSOZC7j6KCcccc
// https://us-central1-colorful-intelligence.cloudfunctions.net/listGameWinners?gameIdList=["-M-6OSOZC7j6KCcccc", "-M-6OSOZC7j6KCxxx"]
// https://us-central1-colorful-intelligence.cloudfunctions.net/listGameWinners?userId=userxcc
exports.listGameWinners = functions.https.onRequest(async (req, res) => {
    console.log("listGameWinners******************************" );
    
    try {
        var gameId = req.query.gameId;
        var idList = req.query.gameIdList;
        var userId = req.query.userId;

        if(gameId !== null && gameId !== undefined){
            var listRefGame = admin.database().ref('/' + DB_GAME_WINNERS + '/' + gameId);
            var listenerGame = listRefGame.on('value', snapshot => {
                listRefGame.off('value', listenerGame);
                const json = {[snapshot.key] : snapshot};
                return res.status(200).send(json);
            });
        }else if(userId !== null && userId !== undefined){
            
            var snapshotMap = new Map();

            var listRefUser = admin.database().ref('/' + DB_GAME_WINNERS);
            var listenerUser = listRefUser.on('value', snapshot =>  {
                snapshot.forEach(childSnapshot => {
                    var gameId = childSnapshot.key;

                    childSnapshot.forEach(tempSnapshot =>{ 
                        var userFound = tempSnapshot.key;

                        if(userFound === userId){
                            const json = {[userFound]:tempSnapshot};
                            snapshotMap.set(gameId, json);
                        }
                    });       
                });
                listRefUser.off('value', listenerUser);
                return res.status(200).send(getJSONFromMap(snapshotMap));
            });
        }else if(idList !== null && idList !== undefined){

            var array = JSON.parse(idList);

            var listRefForId = admin.database().ref('/' + DB_GAME_WINNERS);
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
                listRefForId.off('value', listenerForId);
                return res.status(200).send(getJSONFromMap(snapshotMap));
            });
        }else{
            return res.status(400).send(getErrorMessage(req, 'GameId or idList is null or undefined!'));
        }
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

// https://us-central1-colorful-intelligence.cloudfunctions.net/getGameWinnersCount?gameId=-M-6OSOZC7j6KCcccc
exports.getGameWinnersCount = functions.https.onRequest(async (req, res) => {
    console.log("getGameWinnersCount******************************" );
    
    try {
        var gameId = req.query.gameId;

        if(gameId !== null && gameId !== undefined){
            var listRefGame = admin.database().ref('/' + DB_GAME_WINNERS + '/' + gameId);
            var listenerGame = listRefGame.on('value', snapshot => {

                var count = 0;
                snapshot.forEach(childSnapshot => {
                    count++;
                    console.log('count:' , count);
                });

                listRefGame.off('value', listenerGame);
                return res.status(200).send(count.toString());
            });
        }else{
            return res.status(400).send(getErrorMessage(req, 'GameId is null or undefined!'));
        }
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

//***************************GAME GIFTS FUNCTIONS ***********************************************

// https://us-central1-colorful-intelligence.cloudfunctions.net/saveGameGift?reqQuery={"giftName" : "Hamburger ödülü","giftCode" : "ZJSHTY","decription": "Zamanı dolmadan hamburger ye"}
// https://us-central1-colorful-intelligence.cloudfunctions.net/saveGameGift?reqQuery={"giftName" : "Hamburger yemece","giftCode" : "ZJSHTY","decription": "Zamanı dolmadan hamburger ye"}&giftId=-M-Gzb9A37mAFdAwXA8e
exports.saveGameGift = functions.https.onRequest(async (req, res) => {
    console.log("saveGameGift******************************" );
    
    try {
        const reqQuery = req.query.reqQuery;
        var id = req.query.giftId;
        var jsonResponse = JSON.parse(reqQuery);

        if (jsonResponse.status === 0) {
            return res.status(400).send(getErrorMessage(req, 'Json is not valid!'));
        } else {
            if(id !== null && id !== undefined){
                const snapshot = await admin.database().ref('/' + DB_GAME_GIFTS + '/' + id + '/').update(jsonResponse);
            }
            else{
                const snapshot = await admin.database().ref('/' + DB_GAME_GIFTS).push(jsonResponse);
                id = snapshot.ref.toString();
            }
            var json = JSON.stringify({
               "id":id,
               "message":"Game Gift update successful"
            });
        }
        return res.status(200).send(json);
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

// https://us-central1-colorful-intelligence.cloudfunctions.net/listGameGifts?giftId=-M-Gzb9A37mAFdAwXA8e
// https://us-central1-colorful-intelligence.cloudfunctions.net/listGameGifts?giftIdList=["-M-Gzb9A37mAFdAwXA8e", "-M-H5-Zs3j1ATpO9D-Bn"]
// https://us-central1-colorful-intelligence.cloudfunctions.net/listGameGifts?type=ALL
// type=ALL, type=ACTIVE, type=PASSIVE
exports.listGameGifts = functions.https.onRequest((req, res) => {
    console.log("listGameGifts******************************" );
    
    try {
        var giftId = req.query.giftId;
        var idList = req.query.giftIdList;
        var type = req.query.type;

        if(giftId !== null && giftId !== undefined){
            var listRefGift = admin.database().ref('/' + DB_GAME_GIFTS + '/' + giftId);
            var listenerGift = listRefGift.on('value', snapshot => {
                listRefGift.off('value', listenerGift);
                const json = {[snapshot.key] : snapshot};
                return res.status(200).send(json);
            });
        }else if(idList !== null && idList !== undefined){

            var array = JSON.parse(idList);

            var listRefForId = admin.database().ref('/' + DB_GAME_GIFTS);
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
                listRefForId.off('value', listenerForId);
                return res.status(200).send(getJSONFromMap(snapshotMap));
            });
        }else if(type !== null && type !== undefined){
            if(type !== LIST_TYPE_PASSIVE && type !== LIST_TYPE_ACTIVE && type !== LIST_TYPE_ALL){
                return res.status(400).send(getErrorMessage(req, 'List type is invalid!'));
            }else{
                var listRef = admin.database().ref('/' + DB_GAME_GIFTS);
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
                    listRef.off('value', listener);
                    return res.status(200).send(getJSONFromMap(snapshotMap));
                });
            }
        }else{
            return res.status(400).send(getErrorMessage(req, 'GiftId, idList or list type is null or undefined!'));
        }
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

//***************************USER GAMES FUNCTIONS ***********************************************

// https://us-central1-colorful-intelligence.cloudfunctions.net/saveUserGame?reqQuery={"gameCommentId" : 1,"score" : 50,"isWin": true}&userId=-M-6OgowiJqdmdYcccc
// https://us-central1-colorful-intelligence.cloudfunctions.net/saveUserGame?reqQuery={"gameCommentId" : 2,"score" : 60,"isWin": false}&userId=-M-6OgowiJqdmdYcccc&gameId=-M-6OSOZC7j6KCcccc

exports.saveUserGame = functions.https.onRequest(async (req, res) => {
    console.log("saveGameGift******************************" );
    
    try {
        const reqQuery = req.query.reqQuery;
        var userId = req.query.userId;
        var gameId = req.query.gameId;

        var jsonResponse = JSON.parse(reqQuery);

        if (jsonResponse.status === 0) {
            return res.status(400).send(getErrorMessage(req, 'Json is not valid!'));
        } else {
            if(userId !== null && userId !== undefined && gameId !== null && gameId !== undefined){
                const snapshot = await admin.database().ref('/' + DB_USER_GAMES + '/' + userId + '/' + gameId + '/' ).update(jsonResponse);
            }
            else{
                const snapshot = await admin.database().ref('/' + DB_USER_GAMES + '/' + userId + '/').push(jsonResponse);
                id = snapshot.ref.toString();
            }
            var json = JSON.stringify({
               "id":id,
               "message":"User Game update successful"
            });
        }
        return res.status(200).send(json);
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

// https://us-central1-colorful-intelligence.cloudfunctions.net/listUserGames?userId=-M-6OgowiJqdmdYcccc&gameId=-M-6OSOZC7j6KCcccc
// https://us-central1-colorful-intelligence.cloudfunctions.net/listUserGames?userId=-M-6OgowiJqdmdYcccc&type=ALL
// type=ALL, type=WIN, type=LOSE
exports.listUserGames = functions.https.onRequest(async (req, res) => {
    console.log("listUserGames******************************" );
    
    try {
        var userId = req.query.userId;
        var gameId = req.query.gameId;
        var type = req.query.type;

        if(userId === null || userId === undefined)
            return res.status(400).send(getErrorMessage(req, "Userid is null or undefined!"));

        if(gameId !== null && gameId !== undefined){
            var listRefGift = admin.database().ref('/' + DB_USER_GAMES + '/' + userId + '/' + gameId + '/');
            var listenerGift = listRefGift.on('value', snapshot => {
                const json = {[snapshot.key] : snapshot};
                listRefGift.off('value', listenerGift);
                return res.status(200).send(json);
            });
        }else if(type !== null && type !== undefined){
            if(type !== USER_GAME_TYPE_LOSE && type !== USER_GAME_TYPE_WIN && type !== USER_GAME_TYPE_ALL){
                return res.status(400).send(getErrorMessage(req, 'User game type is invalid!'));
            }else{
                var listRef = admin.database().ref('/' + DB_USER_GAMES + '/' + userId + '/');
                var listener = listRef.on('value', snapshot => {

                    var snapshotMap = new Map();

                    snapshot.forEach(childSnapshot => {
                          var key = childSnapshot.key;
                          var isWin = childSnapshot.val().isWin;

                          if(type === USER_GAME_TYPE_ALL){
                            snapshotMap.set(key, childSnapshot.val());
                          }else if(type === USER_GAME_TYPE_WIN && isWin === true){
                            snapshotMap.set(key, childSnapshot.val());
                          }else if(type === USER_GAME_TYPE_LOSE && isWin === false){
                            snapshotMap.set(key, childSnapshot.val());
                          }
                    });
                    listRef.off('value', listener);
                    return res.status(200).send(getJSONFromMap(snapshotMap));
                });
            }
        }else{
            return res.status(400).send(getErrorMessage(req, 'GameId or type is null or undefined!'));
        }
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

//***************************DEVICE TOKEN FUNCTIONS ***********************************************
// https://us-central1-colorful-intelligence.cloudfunctions.net/saveDeviceToken?reqQuery={"SignIn" : "E","Token" : "HSJAHSJHAJHJSHJHJHJHJHASJH"}&userId=-M-6OgowiJqdmdYcccc
exports.saveDeviceToken = functions.https.onRequest(async (req, res) => {
    console.log("saveGameGift******************************" );
    
    try {
        const reqQuery = req.query.reqQuery;
        var userId = req.query.userId;

        var jsonResponse = JSON.parse(reqQuery);

        if(userId === null || userId === undefined)
            return res.status(400).send(getErrorMessage(req, 'UserId is not valid!'));

        if (jsonResponse.status === 0) {
            return res.status(400).send(getErrorMessage(req, 'Json is not valid!'));
        } else {
            const snapshot = await admin.database().ref('/' + DB_DEVICE_TOKEN + '/' + userId + '/').update(jsonResponse);
        }
        return res.status(200).send("Device Token update successful");
  } catch (error) {
        return res.status(400).send(getErrorMessage(req, error));
  }
});

// https://us-central1-colorful-intelligence.cloudfunctions.net/getDeviceToken?userId=-M-6OgowiJqdmdYcccc
exports.getDeviceToken = functions.https.onRequest(async (req, res) => {
    console.log("listUserGames******************************" );
    
    try {
        var userId = req.query.userId;

        if(userId === null || userId === undefined)
            return res.status(400).send(getErrorMessage(req, "Userid is null or undefined!"));

        var listRefGift = admin.database().ref('/' + DB_DEVICE_TOKEN + '/' + userId + '/');
        var listenerGift = listRefGift.on('value', snapshot => {
            const json = {[snapshot.key] : snapshot};
            listRefGift.off('value', listenerGift);
            return res.status(200).send(json);
        });
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

function getJSONFromMap(snapshotMap){
    const myJson = {};
    myJson.snapshotMap = mapToObj(snapshotMap);
    const json = JSON.stringify(myJson.snapshotMap);
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