#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Feb 16 17:16:55 2020

@author: hduser
"""

import pandas as pd

reddit_body = pd.read_csv("soc-redditHyperlinks-body.tsv", sep='\t',header='infer')
reddit_title = pd.read_csv("soc-redditHyperlinks-title.tsv", sep='\t',header='infer')
reddit_subreddits = pd.read_csv("web-redditEmbeddings-subreddits.csv", sep=',', header=None)
reddit_users = pd.read_csv("web-redditEmbeddings-users.csv",sep=",", header=None)

reddit_body['year'] = pd.DatetimeIndex(reddit_body['TIMESTAMP']).year
reddit_title['year'] = pd.DatetimeIndex(reddit_title['TIMESTAMP']).year
reddit_body['month'] = pd.DatetimeIndex(reddit_body['TIMESTAMP']).month
reddit_title['month'] = pd.DatetimeIndex(reddit_title['TIMESTAMP']).month

# I created a csv with neat column names for the stupid vector thing
# and a dataframe of nfl teams
colnames = pd.read_csv("reddit_colnames.csv",header='infer')
reddit_focus_subreddits = pd.read_csv("reddit_focus_subreddits.csv")
reddit_subreddit_subscribers = pd.read_csv("reddit_subreddits.csv")
reddit_focus_subreddits = reddit_subreddit_subscribers.query('subscribers > 1000')

# BETTER TO MAKE THE DATA SMALL NOW
reddit_body_focus = reddit_body.merge(reddit_focus_subreddits,left_on="SOURCE_SUBREDDIT",right_on = 'subreddit', how='inner')
reddit_body_focus = reddit_body_focus.merge(reddit_focus_subreddits,left_on="TARGET_SUBREDDIT",right_on = 'subreddit', how='inner')

# BETTER TO MAKE THE DATA SMALL NOW
reddit_title_focus = reddit_title.merge(reddit_focus_subreddits,left_on="SOURCE_SUBREDDIT",right_on = 'subreddit', how='inner')
reddit_title_focus = reddit_title_focus.merge(reddit_focus_subreddits,left_on="TARGET_SUBREDDIT",right_on = 'subreddit', how='inner')


#reddit_title = pd.read_csv("soc-redditHyperlinks-title.tsv", sep='\t',header='infer')
#reddit_subreddits = pd.read_csv("web-redditEmbeddings-subreddits.csv", sep=',', header=None)

# Seems like best to just append the body table to the 
# title table... same columns and will just sum-aggregate the numbers

reddit_posts = reddit_title_focus.append(reddit_body_focus)

# Split the vector thing into a set of columns
reddit_posts_colvec = reddit_posts['PROPERTIES'].str.split(',', expand=True)
# put neat column names on that dataframe
reddit_posts_colvec.columns = colnames['colname']
# stitch the original dataframe with the column names
reddit_posts_colvec = reddit_posts_colvec.apply(pd.to_numeric)


reddit_posts_all = reddit_posts.join(reddit_posts_colvec)
# neaten the column names 
reddit_posts_all.columns = map(str.lower, reddit_posts_all.columns)
# These are the word2vec type data for the subreddits and users
reddit_subreddits.rename(columns={0: 'subreddit'}, inplace=True)
# Cant see any use for this user data, nothing to merge it to
reddit_users.rename(columns={0: 'user'}, inplace=True)


# K start aggregating ... this next step should be unnecessary now but im leaving it 
# coz i may need to do something similar later
reddit_posts_all[["neg_sentiment_vader","pos_sentiment_vader"]] = reddit_posts_all[["neg_sentiment_vader","pos_sentiment_vader"]].apply(pd.to_numeric)


reddit_posts_agg = reddit_posts_all. \
    groupby(["source_subreddit","target_subreddit","link_sentiment","year"]) \
    .agg({"pos_sentiment_vader":"mean", \
          "neg_sentiment_vader":"mean",  \
          "compnd_sentiment_vader":"mean",  \
          "post_id":pd.Series.count}).reset_index()



reddit_posts_agg.rename(columns = {"pos_sentiment_vader":"pos_sentiment_vader_mean","neg_sentiment_vader":"neg_sentiment_vader_mean","compnd_sentiment_vader":"compnd_sentiment_vader_mean","post_id":"post_count"}, inplace=True)
#reddit_posts_agg.to_json("reddit_posts_agg.json",orient='records')
reddit_posts_agg.query("post_count>10").query("link_sentiment==1").to_csv("reddit_friends.csv")

reddit_posts_agg.query("post_count>10").query("link_sentiment==-1").to_csv("reddit_enemies.csv")
