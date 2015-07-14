module.exports = {

  'twitterAuth' : {
    'consumerKey'       : process.env.CONSUMER_KEY,
    'consumerSecret'    : process.env.CONSUMER_SECRET,
    'callbackURL'       : 'http://localhost:3000/auth/twitter/callback'
  },

};
