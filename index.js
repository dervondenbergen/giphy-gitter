var Gitter = require('node-gitter');
var request = require('request');
var Giphy = require('giphy');

// get configuration infos from config.js file
// if non available, copy config.example.js and fill out the 
var config = require('./config.js');

var gitter = new Gitter(config.gitter.token);
var giphy = new Giphy(config.giphy.apikey);

// gitter room name from config gets joined, to receive the room id on start
gitter.rooms.join( config.gitter.room.name , function(err, room) {
  
  if (err) {
    console.log('Not possible to join the room: ', err);
    return;
  }
  
  config.gitter.room.id = room.id;
  
  // start the message listener
  listenToMessages();
  
})

function listenToMessages () {

  gitter.rooms.find(config.gitter.room.id).then(function(room) {
 
    var events = room.streaming().chatMessages();
   
    // The 'snapshot' event is emitted once, with the last messages in the room 
    events.on('snapshot', function(snapshot) {
      console.log(snapshot.length + ' messages in the snapshot');
    });
   
    // event gets called, when a new message gets written in the configured channel
    events.on('chatMessages', function(message) {
      
      // the bot only evaluates new messages, no updates or other changes
      if (message.operation === 'create') {
        
        var data = message.model;
        var text = data.text;
        
        // text contains the giphy command
        if (text.match(config.giphy.regex)) {
          
          var user = data.fromUser.username;
          var search = text.replace(config.giphy.regex, '');
          
          // replace underscores and colons to spaces because emojis
          search = search.replace(/_|:/g, ' ').trim();
          
          // if there is search text, search after it
          if (search) {
          
            giphy.search({q: search, limit: 100}, function (err, result, res) {
              
              // if there are results, send a random one
              if (result.data.length) {
              
                var image = result.data[parseInt(Math.random()*result.data.length)];
                
                var imgurl = image.images.original.url;
                
                var feedcontent =  '@' + user + ' : __'+ search +'__ \n\n[!['+search+'](' + imgurl + ')](' + image.url + ')';

                
                send(feedcontent, room);
                
              } else {
                
                // otherwise send a message, that there are no gifs with that search
                var help = '@' + user + ': there is no gif with those words';
                
                send(help, room);
                
              }
              
            });
            
          } else {
            
            // otherwise send an explanation to user
            var help = '@' + user + ': use `/giphy` with a word, to get a gif related to that word, eg. `/giphy cats hats`';
            
            send(help, room);
            
          }
          
        }
        
      }
      
    });
  });

}

function send (message, room) {
  
  // switch, where the message should be sent
  switch (config.gitter.place) {
    case 'activity':  
      request.post(config.gitter.webhook).form({message: message});
      break;
  
    case 'chat':
      room.send(message);
      break;
  
    default:
      console.log(message);
      break;
  }
  
}
