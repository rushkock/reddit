
import pandas as pd

from sklearn.cluster import KMeans

reddit_subreddits = pd.read_csv("web-redditEmbeddings-subreddits.csv", sep=',', header=None)
reddit_subreddits.rename(columns={0: 'subreddit'}, inplace=True)

ml_X_cols = range(1,301)
from sklearn.decomposition import PCA

km = KMeans(n_clusters=10, random_state=0).fit(reddit_subreddits[ml_X_cols])
reddit_subreddits['kmeans_class'] = km.labels_

# This statement only moves kmeans-class column to the front of the dataframe
reddit_subreddits = reddit_subreddits.set_index('kmeans_class').reset_index()

print("hi")


