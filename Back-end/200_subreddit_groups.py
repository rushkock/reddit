# -*- coding: utf-8 -*-
"""
Created on Thu Feb 20 12:45:37 2020

@author: glenc
"""

import pandas as pd

subreddits = pd.read_csv("reddit_subreddits_groups.txt",header=None)

subreddits.rename(columns={0: 'subreddit'}, inplace=True)
subreddits_groups = pd.DataFrame(columns = ['parent_group','child_group','subreddit'])

subreddit_row = pd.DataFrame(columns=['parent_group', 'child_group', 'subreddit'])
subreddit_row = subreddit_row.append({'parent_group': '', 'child_group': '', 'subreddit': ''}, ignore_index=True)
i=0
prev_group = ''
prev_group_row = 0
parent_group = ''
child_group = ''

for row in subreddits['subreddit']:
    i = i + 1
    if row.startswith('/r/'):
        print('output row with ' + row)
        subreddit_row['subreddit']=row[3:]
        subreddit_row['parent_group']=parent_group
        subreddit_row['child_group']=child_group
        subreddits_groups = subreddits_groups.append(subreddit_row)
    else:
        print('set group = ' + row)
        curr_group = row
        curr_group_row = i
        print('curr group ' + curr_group)           
        print('curr group row {}'.format(i))           
        print('prev group {}'.format(prev_group))           
        print('prev group row {}'.format(prev_group_row))           
        if (curr_group_row-1 == prev_group_row):
            print("Bingo")
            parent_group= prev_group
        child_group=row            
        print('--------------------')
        prev_group = row
        prev_group_row = i
        
#        subreddit_row['child_group']= row 
        
        
subreddits_groups['child_group'] = subreddits_groups['child_group'].str.lower()
subreddits_groups['parent_group'] = subreddits_groups['parent_group'].str.lower()
subreddits_groups['subreddit'] = subreddits_groups['subreddit'].str.lower()

subreddits_groups.to_csv("reddit_subreddits_groups.csv", index=False)
