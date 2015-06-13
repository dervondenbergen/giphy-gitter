var config = {

  // gitter settings for retrieving and sending messages
  gitter: {
    // gitter token, can be retrieved from https://developer.gitter.im/apps
    token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',


    room: {
      // name of the gitter room, you want to retrieve and send the messages
      name: 'bullgit/bombing'
    },
    
    // custom webhook to send the gifs to the activity feed
    webhook: 'https://webhooks.gitter.im/e/xxxxxxxxxxxxxxxxxxxx',
    
    // place, where gif should be sent
    // possibilities: activity, chat
    // if "chat" the message will be send from the user from whom the token is
    place: 'activity'

  },
  
  giphy: {
   
   // giphy api key
   apikey: 'xxxxxxxxxxxxx',
   
   // regex to match the giphy command (could be anything)
   regex: /^\/giphy/
    
  }
  
}

module.exports = config;
