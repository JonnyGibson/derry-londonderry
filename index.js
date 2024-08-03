const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  bearer_token: process.env.BEARER_TOKEN,
});

async function runBot() {
  try {
    const stream = client.stream('statuses/filter', { track: ['Derry', 'Londonderry'] });

    stream.on('data', (tweet) => {
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

    stream.on('error', (error) => {
      console.error('Stream error', error);
    });

  } catch (error) {
    console.error('Scheduled function error', error);
  }
}

runBot();
