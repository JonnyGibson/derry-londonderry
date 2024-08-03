const Twitter = require('twitter');
const { format, subHours } = require('date-fns');

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  bearer_token: process.env.BEARER_TOKEN,
});

async function runBot() {
  try {
    // Get the current date and time
    const now = new Date();
    // Get the date and time from one hour ago
    const oneHourAgo = subHours(now, 1);

    // Format dates for the query
    const since = format(oneHourAgo, 'yyyy-MM-dd');
    const until = format(now, 'yyyy-MM-dd');

    // Fetch tweets from the past hour using the search API
    const tweets = await client.get('search/tweets', {
      q: 'Derry OR Londonderry',
      count: 100, // Adjust this number based on your needs
      result_type: 'recent', // Ensure we get the most recent tweets
    });
    // Log the number of tweets found
    console.log(`Found ${tweets.length} tweets matching the criteria. since: ${since}`);

    // Process each tweet
    tweets.statuses.forEach(tweet => {
      const text = tweet.text.toLowerCase();
      if (text.includes('derry')) {
        client.post('statuses/update', {
          status: 'Actually, it\'s Londonderry. 😉',
          in_reply_to_status_id: tweet.id_str,
          auto_populate_reply_metadata: true
        }, (err, tweet, response) => {
          if (err) {
            console.error('Error posting tweet', err);
          } else {
            console.log('Successfully posted tweet', tweet);
          }
        });
      } else if (text.includes('londonderry')) {
        client.post('statuses/update', {
          status: 'Actually, it\'s Derry. 😉',
          in_reply_to_status_id: tweet.id_str,
          auto_populate_reply_metadata: true
        }, (err, tweet, response) => {
          if (err) {
            console.error('Error posting tweet', err);
          } else {
            console.log('Successfully posted tweet', tweet);
          }
        });
      }
    });
  } catch (error) {
    console.error('Error in runBot function', error);
  }
}

// Run the bot
runBot();
