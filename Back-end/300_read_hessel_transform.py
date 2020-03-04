# -*- coding: utf-8 -*-
"""
Created on Wed Mar  4 13:24:11 2020

@author: glenc
"""

import pandas as pd

csv = pd.read_csv("subreddits_norm_toxic.csv")

csv_rename = csv.rename(columns=
                                {'SOURCE_SUBREDDIT':'source_subreddit',
                                 'TARGET_SUBREDDIT':'target_subreddit',
                                  'negative':'negative_posts',
                                  'positive':'positive_posts',
                                  'Sum':'total_posts',
                                  'toxicity':'toxicity_ratio',
                                  'norm_toxicity': 'norm_toxicity_ratio'
                                 }).drop(columns='Unnamed: 0')

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

csv_with_tots = csv_neat.drop(columns='row_count') \
                        .merge(csv_agg[['source_parent_group','source_child_group', 'source_subreddit','row_count']], \
                            left_on = ['source_parent_group','source_child_group', 'source_subreddit'], \
                            right_on = ['source_parent_group','source_child_group', 'source_subreddit'], \
                            how = "inner").rename(columns = {"row_count":"source_subreddit_row_count"})

csv_with_tots["toxicity_rank"] = csv_with_tots.groupby(['source_subreddit']) \
                                ["toxicity_ratio","total_posts"].rank("first", ascending=False)

csv_with_tots.drop(columns = "norm_toxicity_accum").to_csv("source_subreddit_summary.csv",index=False)
csv_agg.to_csv("source_target_subreddit_stats.csv",index=False)
