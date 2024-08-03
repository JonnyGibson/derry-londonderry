const Twitter = require('twitter');
const { format, subHours } = require('date-fns');

// Initialize Twitter client
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  bearer_token: process.env.BEARER_TOKEN,
});

async function runBot() {
  try {
    // Define time range for the past hour
    const now = new Date();
    const since = format(subHours(now, 1), 'yyyy-MM-dd');
    const until = format(now, 'yyyy-MM-dd');

    // Search for tweets
    const tweets = await client.get('search/tweets', {
      q: 'Derry OR Londonderry',
      since: since,
      until: until,
      count: 100, // Adjust this number based on your needs
    });

    // Log the number of tweets found
    console.log(`Found ${tweets.statuses.length} tweets matching the criteria.`);

    // Process each tweet
    for (const tweet of tweets.statuses) {
      const text = tweet.text.toLowerCase();
      if (text.includes('derry')) {
        await client.post('statuses/update', {
          status: 'Actually, it\'s Londonderry. 😉',
          in_reply_to_status_id: tweet.id_str,
          auto_populate_reply_metadata: true,
        });
        console.log(`Replied to tweet ID ${tweet.id_str} about 'derry'.`);
      } else if (text.includes('londonderry')) {
        await client.post('statuses/update', {
          status: 'Actually, it\'s Derry. 😉',
          in_reply_to_status_id: tweet.id_str,
          auto_populate_reply_metadata: true,
        });
        console.log(`Replied to tweet ID ${tweet.id_str} about 'londonderry'.`);
      }
    }

  } catch (error) {
    console.error('Error in bot execution:', error);
  }
}

runBot();
