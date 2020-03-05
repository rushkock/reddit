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
reddit_subreddit_subscribers = pd.read_csv("reddit_subreddits.csv")
reddit_subreddit_groups = pd.read_csv("reddit_subreddits_groups.csv",header="infer")
colnames = pd.read_csv("reddit_colnames.csv",header='infer')
reddit_focus_subreddits = pd.read_csv("reddit_focus_subreddits.csv")

reddit_body['year'] = pd.DatetimeIndex(reddit_body['TIMESTAMP']).year
reddit_title['year'] = pd.DatetimeIndex(reddit_title['TIMESTAMP']).year
reddit_body['month'] = pd.DatetimeIndex(reddit_body['TIMESTAMP']).month
reddit_title['month'] = pd.DatetimeIndex(reddit_title['TIMESTAMP']).month
reddit_body['quarter'] = pd.DatetimeIndex(reddit_body['TIMESTAMP']).quarter
reddit_title['quarter'] = pd.DatetimeIndex(reddit_title['TIMESTAMP']).quarter

# All of these steps are coming up with the focus group (which i havent decided on yet)
reddit_subreddit_subscribers['subreddit'] = reddit_subreddit_subscribers['subreddit'].str.lower()
reddit_subreddit_subscribers.sort_values(by='subscribers', ascending=False, inplace=True)

#reddit_focus_subreddits =   reddit_subreddit_subscribers.query('subscribers > 5000')
#reddit_subreddits =         reddit_subreddit_subscribers.query('subscribers > 5000')
# Set the focus group to politics video games sports
#reddit_focus_subreddits =   reddit_subreddit_groups.query("parent_group in ('video games','sports','news/politics')")['subreddit']


# Merge the focus group to the body and title to make it small now (its too big otherwise)
#reddit_body_focus = reddit_body.merge(reddit_focus_subreddits,
#                                      left_on="SOURCE_SUBREDDIT",
#                                      right_on = 'subreddit', 
#                                      how='inner')
#reddit_body_focus = reddit_body_focus.merge(reddit_focus_subreddits,
#                                            left_on="TARGET_SUBREDDIT",
#                                            right_on = 'subreddit', 
#                                            how='inner')
#reddit_title_focus = reddit_title.merge(reddit_focus_subreddits,left_on="SOURCE_SUBREDDIT",
#                                        right_on = 'subreddit', how='inner')
#reddit_title_focus = reddit_title_focus.merge(reddit_focus_subreddits,left_on="TARGET_SUBREDDIT",
#                                              right_on = 'subreddit', how='inner')


# Seems like best to just append the body table to the 
# title table... same columns and will just sum-aggregate the numbers
reddit_posts = reddit_title.append(reddit_body)
#glen = reddit_posts.query("SOURCE_SUBREDDIT=='bestoflegaladvice'")
#glen = reddit_posts.head()

reddit_posts = reddit_posts.merge(reddit_subreddit_groups
                                  .rename(columns={'parent_group':'target_parent_group',
                                                   'child_group':'target_child_group'}) ,
                                  left_on = "TARGET_SUBREDDIT", right_on='subreddit',how='left')

reddit_posts = reddit_posts.merge(reddit_subreddit_groups
                                  .rename(columns={'parent_group':'source_parent_group',
                                                   'child_group':'source_child_group'}) ,
                                  left_on = "SOURCE_SUBREDDIT", right_on='subreddit',how='left')

reddit_posts.columns = map(str.lower, reddit_posts.columns)

#glen = reddit_posts.query("SOURCE_SUBREDDIT=='bestoflegaladvice'")

###################################################################
## THIS next block is for data that we presently do not need
## commented out but it should work fine if you comment back in
#################################################################3
# Split the vector thing into a set of columns
reddit_posts_colvec = reddit_posts['properties'].str.split(',', expand=True)
# put neat column names on that dataframe
reddit_posts_colvec.columns = colnames['colname']
reddit_posts_colvec.columns = map(str.lower, reddit_posts_colvec.columns)
reddit_posts_colvec.columns = reddit_posts_colvec.columns.str.replace(' ', '')


reddit_posts_colvec_ss = reddit_posts_colvec[['neg_sentiment_vader', 'liwc_negemo', \
                                              'liwc_anx', 'liwc_anger', 'liwc_sad',  \
                                              'liwc_swear']]
glen = reddit_posts_colvec_ss.head()

# stitch the original dataframe with the column names
reddit_posts_colvec_ss = reddit_posts_colvec_ss.apply(pd.to_numeric)

reddit_posts_all = reddit_posts.join(reddit_posts_colvec_ss)
# neaten the column names 
reddit_posts_all.columns = map(str.lower, reddit_posts_all.columns)
glen = reddit_posts_all.head()

# These are the word2vec type data for the subreddits and users
#reddit_subreddits.rename(columns={0: 'subreddit'}, inplace=True)
# Cant see any use for this user data, nothing to merge it to
#reddit_users.rename(columns={0: 'user'}, inplace=True)

# K start aggregating ... this next step should be unnecessary now but im leaving it 
# coz i may need to do something similar later
#reddit_posts_all[["neg_sentiment_vader","pos_sentiment_vader"]] = reddit_posts_all[["neg_sentiment_vader","pos_sentiment_vader"]].apply(pd.to_numeric)
###################################################################
##################################################################

reddit_posts_agg = reddit_posts_all. \
    groupby(["source_parent_group"
             ,"source_child_group"
             ,"source_subreddit"
             ,"target_parent_group"
             ,"target_child_group"
             ,"target_subreddit"
             ,"link_sentiment"]) \
    .agg({"post_id":pd.Series.count
          }).reset_index()

reddit_posts_agg.rename(columns = {"post_id":"post_count"}, inplace=True)

reddit_posts_agg2 = reddit_posts_all. \
    groupby(["source_parent_group"
             ,"source_child_group"
             ,"source_subreddit"
             ]) \
    .agg({"neg_sentiment_vader":pd.Series.mean,
          "liwc_negemo":pd.Series.mean,
          "liwc_anx":pd.Series.mean,
          "liwc_anger":pd.Series.mean,
          "liwc_sad":pd.Series.mean,
          "liwc_swear":pd.Series.mean
          }).reset_index()
          
glen = reddit_posts_agg2.query("source_subreddit=='bestoflegaladvice'")

reddit_posts_ct = pd.crosstab(index=[reddit_posts_agg.source_parent_group,
                                  reddit_posts_agg.source_child_group,  
                                  reddit_posts_agg.source_subreddit,
                                  reddit_posts_agg.target_parent_group,
                                  reddit_posts_agg.target_child_group,
                                  reddit_posts_agg.target_subreddit], 
                           columns = reddit_posts_agg.link_sentiment, 
                           values=reddit_posts_agg.post_count, 
                                  aggfunc=pd.Series.sum
                           ).reset_index()

reddit_posts_ct.rename(columns = {-1:"neg_post_count",1:"pos_post_count"}, inplace=True)

reddit_posts_ct.fillna(0,inplace=True)
reddit_posts_ct['tot_post_count']=reddit_posts_ct['pos_post_count']+reddit_posts_ct['neg_post_count']
reddit_posts_ct = reddit_posts_ct.query("tot_post_count>10") # chop the data down to 10 posts minimum

reddit_posts_ct['toxicity_ratio']=reddit_posts_ct['neg_post_count']/(reddit_posts_ct['pos_post_count']+reddit_posts_ct['neg_post_count'])
reddit_posts_ct['norm_toxicity_ratio'] = reddit_posts_ct['toxicity_ratio'] / reddit_posts_ct['toxicity_ratio'].max()



reddit_posts_ct.to_csv("reddit_subreddit_totals.csv",index=False)




csv_rename = reddit_posts_ct.rename(columns=
                                {'neg_post_count':'negative_posts',
                                  'pos_post_count':'positive_posts',
                                  'tot_post_count':'total_posts'
                                 })


csv_neat = csv_rename[['source_parent_group','source_child_group', 'source_subreddit',
                       'target_parent_group','target_child_group', 'target_subreddit',
                       'total_posts','negative_posts','positive_posts',
                       'toxicity_ratio','norm_toxicity_ratio']]

csv_neat['norm_toxicity_accum'] = csv_neat['norm_toxicity_ratio']* csv_neat['total_posts']
csv_neat['row_count'] = 1

csv_agg = csv_neat.groupby(['source_parent_group','source_child_group', 'source_subreddit']) \
                .agg({'total_posts':'sum',
                  'negative_posts':'sum',
                  'positive_posts':'sum',
                  'norm_toxicity_accum':'sum',
                  'row_count':'sum'
                  }).reset_index()

csv_agg['toxicity_ratio'] = csv_agg['negative_posts']/csv_agg['total_posts']
csv_agg['norm_toxicity_ratio'] = csv_agg['norm_toxicity_accum']/csv_agg['total_posts']
csv_agg.rename(columns = {"row_count":"source_subreddit_row_count"}, inplace=True)

csv_agg2 = csv_agg.merge(reddit_posts_agg2,
                            left_on = ['source_parent_group','source_child_group', 'source_subreddit'], \
                            right_on = ['source_parent_group','source_child_group', 'source_subreddit'], \
                            how = "inner")


csv_with_tots = csv_neat.drop(columns='row_count') \
                        .merge(csv_agg[['source_parent_group','source_child_group', 'source_subreddit','source_subreddit_row_count']], \
                            left_on = ['source_parent_group','source_child_group', 'source_subreddit'], \
                            right_on = ['source_parent_group','source_child_group', 'source_subreddit'], \
                            how = "inner")

# i dont know why i need to initialize the field to make it work but this works
csv_with_tots['toxicity_rank']= 0
csv_with_tots["toxicity_rank"] = csv_with_tots.groupby(['source_subreddit']) \
                                ["toxicity_ratio","total_posts"] \
                                .rank("first", ascending=False)


csv_with_tots.drop(columns = "norm_toxicity_accum") \
    .to_csv("source_target_subreddit_stats.csv",index=False)

csv_agg2.to_csv("source_subreddit_summary.csv",index=False)

