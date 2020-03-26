# Build a Cryptocurrency News Twitter Bot with LunarCRUSH & Python

Imagine a Cryptocurrency Twitter Bot that posts tweets depending on the present cryptocurrency market activity. This is possible with Python, Tweepy, and LunarCRUSH. Keep reading this story and you will find out how to build a Twitter Bot with Python.

The twitter bot pulls information from LunarCRUSH. The metrics for Bitcoin, Ethereum, Litecoin stored as formatted variables and tweeted out automatically every 30 minutes.

# Setting up a Twitter Development Account and Tweepy

First of all, we need to install Tweepy. We can easily install it in the terminal using the pip command:
```python
pip install tweepy
```

Now we have Tweepy Installed, the Python library which handles a majority of the work. Next, we need to create a Twitter developer account. Twitter for Developers offers a developer platform that provides access to Twitter API in oder to "Publish and analyze Tweets, optimize ads, and create unique customer experiences" . Check out the Twitter API documentation here. We can perform multiple tasks through this API. See below some of them:

Post and retrieve tweets
Follow and unfollow users
Post direct messages

However, before we are able to use the Twitter API end points, we need to create a developer account and generate our API keys. You can apply for a developer account directly here. You must answer questions on how you plan to use the API and accept the Twitter Developer Agreement and then you will be granted access to the Developer Dashboard.
Once you are approved access to the Developers for Twitter, login to the developer site and create your App. 
This step will automatically generate your consumer API keys and access tokens that you should keep secret.
The developer account should be linked to the Twitter account where you want to have the bot active. From the Twitter Development platform, we are able to edit the app permissions. I have granted my app permission to read, write and send direct messages.

# Introduction to LunarCRUSH - Social Listening For Crypto

Head over to LunarCRUSH.com and setup an account.

Create Account on LunarCRUSH

Next head to the developers section and click widgets.

Generate V2 API Key

# Building a Twitter bot with Python, Tweepy, LunarCRUSH
Let's start building our Twitter bot. As mentioned previously, we will use the Tweepy library which will work seemlessly with Twitter API and LunarCRUSH API / LunarSTREAM™.
First, we import tweepy. Tweepy makes it easier to authenticate to the API through our Twitter App secret keys.
Below extract of code, we do this by creating a OAuthHandler instance to handle our login by passing the consumer key and consumer secret as arguments.

In order to be able to make requests to the API, we send back an access token. 
We use the auth.set_access_token method to store the access request token for our session.
We are ready to control our Twitter Account with Python. Note that I have included XXX instead of my real secret keys. Replace XXX by your secret keys that you can obtain in your Twitter Developers Dashboard.
```python

import tweepy
import urllib.request
import ssl
import json
import time
ssl._create_default_https_context = ssl._create_unverified_context
# Oauth keys
consumer_key ="XXX"
consumer_secret ="XXX"
access_token ="XXX"
access_token_secret ="XXX"
# Authentication with Twitter
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)
```
Our variable api is where we store the auth settings. We will use it to make requests to the Twitter API.
The idea of this twitter bot is to publish a different tweet, every x amount of minutes with specific cryptocurrency coin / token metrics. This can be easily done using LunarCRUSH API & LUNARSTREAM™.
Let's add our LunarCRUSH API Keys to the code. Simply add:
``` python
api_key = "XXX"
```
Now that we are authenticated with LunarCRUSH API, we can decide which Cryptocurrencies we want to integrate data with to tweet about. We will use coin_list to store the different crypto symbols. For instance, 'LTC' is Litecoin, 'ETH' is Ethereum, and 'BTC' is Bitcoin.
```python
# Allows adding as many coins as desired
coin_list = [
    "LTC",
    "ETH",
    "BTC"
]
coins = ','.join(coin_list)
```
A list of the fields desired from the API - key is the LunarCRUSH key, and the value is the field name outputted to Twitter.
{"LUNAR_CRUSH_KEY": "RENDERED_NAME"}
For example, to add tweet_replies:
{"tweet_replies": "Tweet Replies: "},
you would add this to the list below.

List comprehensions provide a concise way to create lists. Common applications are to make new lists where each element is the result of some operations applied to each member of another sequence or iterable, or to create a subsequence of those elements that satisfy a certain condition. - Python Data Structures Docs
We can now map which values we want to pull from LunarCRUSH API. As the program becomes more complex, this should be written in a more robust manner.
```python
map = [
    {"name":""},
    {"symbol": ""},
    {"price": " Price: "},
    {"percent_change_24h": " - 24 Hour Percent Change: "},
    {"market_cap": " Market Cap: "},
    {"volume_24h": " 24 Hour Volume: "},
    {"url_shares": " URL Shares: "},
    {"reddit_posts": " Reddit Posts: "},
    {"tweets": " Tweets: "},
    {"galaxy_score": " Galaxy Score: "},
    {"volatility": " Volatility: "},
    {"social_volume": " Social Volume: "},
    {"news": " News: "},
    {"close": " Close: "},
]
def final_render(asset_tweet, value, key, asset):
    if key == 'symbol':
        asset_tweet += " (" + asset[key] + ")"
    elif key == 'percent_change_24h':
        asset_tweet += value + str(asset[key]) + "%"
    else:
        asset_tweet += value + str(asset[key])
    return asset_tweet
Now, Iterate over each of the fields from LunarCRUSH which gets the value from LunarCRUSH and renders it with the field name.


def main():
    url = "https://api.lunarcrush.com/v2?data=assets&key=" + api_key + "&symbol=" + coins
    assets = json.loads(urllib.request.urlopen(url).read())
    for asset in assets['data']:
        asset_tweet = ""
        for field in map:
            key = list(field.keys())[0]
            value = list(field.values())[0]
            asset_tweet = final_render(asset_tweet, value, key, asset)
        print(asset_tweet)
        print(len(asset_tweet))
        # Posts tweets
        api.update_status(status=asset_tweet)
    # Runs main() every 30 minutes
while True:
    main()
    time.sleep(1800)
```

# Complete Python Code
```python
import urllib.request
import ssl
import json
import time
import tweepy
ssl._create_default_https_context = ssl._create_unverified_context
# Oauth keys
consumer_key ="XXX"
consumer_secret ="XXX"
access_token ="XXX"
access_token_secret ="XXX"
# Authentication with Twitter
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)
#LunarCRUSH API Key
api_key = "XXX"
# Allows adding as many coins as desired
coin_list = [
    "LTC",
    "ETH",
    "BTC"
]
coins = ','.join(coin_list)
# A list of the fields desired from the API - key is the Lunar Crush key, and the value is the field name outputted to Twitter
# {"LUNAR_CRUSH_KEY": "RENDERED_NAME"}
# For example, to add tweet_replies, you would add:
# {"tweet_replies": "Tweet Replies: "},
# to the list below.
map = [
    {"name":""},
    {"symbol": ""},
    {"price": " Price: "},
    {"percent_change_24h": " - 24 Hour Percent Change: "},
    {"market_cap": " Market Cap: "},
    {"volume_24h": " 24 Hour Volume: "},
    {"url_shares": " URL Shares: "},
    {"reddit_posts": " Reddit Posts: "},
    {"tweets": " Tweets: "},
    {"galaxy_score": " Galaxy Score: "},
    {"volatility": " Volatility: "},
    {"social_volume": " Social Volume: "},
    {"news": " News: "},
    {"close": " Close: "},
]
def final_render(asset_tweet, value, key, asset):
    # As the program becomes more complex, this should be written in a more robust manner
    if key == 'symbol':
        asset_tweet += " (" + asset[key] + ")"
    elif key == 'percent_change_24h':
        asset_tweet += value + str(asset[key]) + "%"
    else:
        asset_tweet += value + str(asset[key])
    return asset_tweet


# Iterates over each of the fields from Lunar Crush, gets the value from Lunar Crush and renders it with the field name
def main():
    url = "https://api.lunarcrush.com/v2?data=assets&key=" + api_key + "&symbol=" + coins
    assets = json.loads(urllib.request.urlopen(url).read())
    for asset in assets['data']:
        asset_tweet = ""
        for field in map:
            key = list(field.keys())[0]
            value = list(field.values())[0]
            asset_tweet = final_render(asset_tweet, value, key, asset)
        print(asset_tweet)
        print(len(asset_tweet))
        # Posts tweets
        api.update_status(status=asset_tweet)
    # Runs main() every 30 minutes
while True:
    main()
    time.sleep(1800)
 ```
Additional Functionalities to Include in a LunarCRUSH + Python Twitter Bot
Not only can we post tweets, our LunarCRUSH Python Tweepy Twitter Bot can perform additional functionalities. 
For example:
Pull information about a particular Twitter user - User methods
Send direct messages - Direct Message Methods
Follow and unfollow users - Friendship Methods
Block and unblock users - Block Methods

 # Configuration Options [https://github.com/levid/lunarcrush-widget-example]
It is possible to configure the bot to extract additional features. For example:
```
?key={API_KEY_HERE} - Required to render the widgets.
?symbol=BTC - Change the symbol that is displayed in the widgets.
?interval=1 Week - Change the time interval being displayed in the charts (default is 1 Week).
?price_correlation=true|false - Show a price line in addition to the selected metric (default = false)
?metric=galaxy_score - Change the timeseries metric being displayed (Metric widget only).
?animation=true|false - Show or hide component animations (default = true)
?theme={See themes section for instructions}
?scrolling=true|false (default = true) - Enable or disable scrolling on the widget inner content. Use this if you want to set scrolling=false on the iframe with a fixed height but still want to allow scrolling within the widget.

```

We have the ability to configure and add an enormous amount of metrics from LunarCRUSH, supported metrics:

```
market_cap (Market Cap)
galaxy_score (Galaxy Score)
price_score (Price Score)
average_sentiment (Average Sentiment)
social_impact_score (Social Impact Score)
market_cap (Market Cap)
galaxy_score (Galaxy Score)
price_score (Price Score)
average_sentiment (Average Sentiment)
social_impact_score (Social Impact Score)
correlation_rank (Correlation Rank)
volatility (Volatility)
social_score (Social Volume)
social_volume (Social Volume)
twitter_volume (Twitter Volume)
reddit_volume (Reddit Volume)
news_volume (News Volume)
search_volume (Search Volume)
spam_volume (Spam Volume)
bullish_sentiment (Bullish Sentiment)
bearish_sentiment (Bearish Sentiment)

Metrics Widgets
average_sentiment (Average Sentiment)
correlation_rank (Correlation Rank)
galaxy_score (Galaxy Score)
market_cap (Market Cap)
market_cap_rank (Market Cap Rank)
news_articles (News Volume)
popular_tweet (Popular Tweets)
price_btc (Price BTC)
price_score (Price Score)
priceclose (Price Close)
pricehigh (Price High)
pricelow (Price Low)
priceopen (Price Open)
reddit_comment (Reddit Comments)
reddit_post (Reddit Posts)
reddit_post_reddit_comment (Reddit Volume)
search_average (Search Volume)
social_impact_score (Social Impact Score)
social_score (Social Volume)
tweet (Twitter Volume)
tweet_sentiment1 (Very Bearish Sentiment)
tweet_sentiment2 (Bearish Sentiment)
tweet_sentiment2_tweet_sentiment (Negative Sentiment)
tweet_sentiment3 (Neutral Sentiment)
tweet_sentiment4 (Bullish Sentiment)
tweet_sentiment5 (Very Bullish Sentiment)
tweet_sentiment4_sentiment5 (Positive Sentiment)
tweet_sentiment_impact1 (Very Bearish Sentiment Impact)
tweet_sentiment_impact2 (Bearish Sentiment Impact)
tweet_sentiment_impact3 (Neutral Sentiment Impact)
tweet_sentiment_impact4 (Bullish Sentiment Impact)
tweet_sentiment_impact5 (Very Bullish Sentiment Impact)
tweet_spam (Spam Volume)
volatility (Volatility)
volumefrom (Market Volume Open)
volumeto (Market Volume Close)
```


# Final Thoughts
Within a few lines of code, we built an easily configurable Twitter bot which pulls data from LunarCRUSH and we have it automatically posting Cryptocurrency markets, metrics, price data, and more.

