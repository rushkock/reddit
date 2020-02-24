# Reddit

Project Information Visualization - Group 22

- We need to come up with a question we want to answer.
- We need to have a story that we want to tell the user.
- The user should be able to understand what's going on.

For next week:

- Answer the above questions.
- Figure out all the properties of the data set.
- How do we want to implement analytics?
- How do we combine visualization and analytics?

2020-02-16
Activities Completed:
- read the 4 csv files.  Broke the vector column into individual fields and made them pretty
- subset using test-subset csv (data is big enough to crash laptops)
- append the title and body table, summarize sentiment and count num posts
- export as json 

2020-02-17
Activities Completed:
- Found out what all properties of the dataset mean. See the following link: https://www.kovcomp.co.uk/wordstat/LIWC.html
- Added new file containing some functions to find sentiment

Of note: 
- it's not easy to trace back to the original reddit post from the data
- thus difficult to validate by finding the reddit post
- users table is nice but there's no way to link to the post so its useless
- subreddits csv has 300 word2vec type columns which may be useful for 
  clustering algorithms (to find groups of similar subreddits)

2020-02-19
- The 'subreddit' file has 300 columns of word2vec type information.  We clustered this into 10 clusters
  using kmeans (attempting to get groups of similar subreddits.  The results are not clear.
  For example, group 10 is clearly inappropriate subreddits, but the other 9 are not apparent. 
- bokeh test server set up and simple D3 visual using csv data set up.     

2020-02-23 
- created file of subreddit groups
- created csv file of politics, video games, and sports subreddit crossposts

2020-02-24:
- Created for each subreddit amount of positive and negative posts
- Added toxicity level for each subreddit
