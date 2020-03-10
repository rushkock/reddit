#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Mar  7 18:29:23 2020

@author: hduser
"""

import pandas as pd

csv = pd.read_csv("source_subreddit_summary.csv")

csv_test1 = csv.query("source_subreddit=='the_donald' and agg_level == 0")
csv_test2 = csv.query("source_subreddit=='politics' and agg_level == 0")
csv_test3 = csv.query("source_subreddit=='sandersforpresident' and agg_level == 0")

csv_test = csv_test1.append(csv_test2.append(csv_test3))

csv_test = csv.query("agg_level == 0 or agg_level == 3")
csv_test['source_subreddit'][0]= 'all'

my_dict = csv.to_dict(orient="index")

my_dict

colname_dict = {'liwc_negemo':'Negative Emotions','liwc_anx':'Anxiety', \
                        'liwc_anger': 'Anger','liwc_sad':"Sadness", \
                        'liwc_swear':"Swearwords",'liwc_money':"Money", \
                        'liwc_relig':"Religion",'liwc_death':"Death"}

big_list = []
for index, row in csv_test.iterrows():
    print(row['source_subreddit'])
    
    little_list = []
    subreddit_dict = {}
    
    for col in csv_test.columns:
        if col in [ #'source_parent_group','source_child_group','source_subreddit' \
 #               'pos_sentiment_vader','compnd_sentiment_vader', 'neg_sentiment_vader', \
                        'liwc_negemo','liwc_anx', \
                        'liwc_anger','liwc_sad', \
                        'liwc_swear','liwc_money', \
                        'liwc_relig','liwc_death' \
                        ]:
            little_dict = {}
            little_dict['axis']= colname_dict[col]
            little_dict['value']= row[col]
            little_list.append(little_dict)
    subreddit_dict['key']=row['source_subreddit']
    subreddit_dict['values']=little_list
    big_list.append(subreddit_dict)

big_list

import json
with open('subreddits_radar.json', 'w') as fout:
    json.dump(big_list, fout)
    
    