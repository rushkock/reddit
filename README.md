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

2020-02-25
- Hessel made a better data file with normalized toxicity and more info.
- Data is extremely imbalanced in that most reddit crossposts are not toxic
  So, we need to decide if we should focus on the toxic stuff for the visual.
- Ruchella is working on the visual components and the current 'theme' is chemisty
- 
2020-03-01

- We had some bar graphs in Bokeh showing the toxicity of the selected subreddit towards the target subreddits, however instead of these, a radar graph will be used.
- Two types of radar graphs were created by Adél in Bokeh. One of those has the target subreddits in the vertices of the 'spider net' and in the other one the toxicity and the positivity indicators are the vertices. On Monday/Tuesday it has to be discussed which one to use. Further data preparation is necessary based on the decision.
- The chosen bokeh radar graph still has to be implemented to Flask.

2020-03-05 - Midterm evaluation
- how to guide the user so that they understand the app flow: use multiple dynamic components that use movement to guide the user
- Toxicity is just one thing we an be brewing
- Using dynamic movement to capture the users attention.  Movement.

2020-03-10
- We had some struggles getting bokeh and d3 to integrate cleanly and began some work to see
  if using entirely d3 is easier.  We implemented a similar radar graph in d3 and intend to cut
  the bokeh cord.
- data changes - aggregation of data by subreddit hierarchy, inclusion of sentiment fields to make the 
  radar chart more meaningful.
- data issues - sentiment "vader" fields are on a different scale than "LIWC" data.  Will investigate using
  other LIWC fields for radar chart.  
  
2020-03-11 - 2020-03-20 
- priority for this week was incorporating the feedback from Gjorgji from last week's meeting, including:
  - add line chart to show the user's toxicity story as they select 
  - add hover toxicity functionality to the line chart
  - add buttons to show line/radar chart interchangeably
  - animation changes within the brewing beaker section 
  - radar chart changes (LIWC data)
  - network diagram finishing touches (glow, hierarchy, colour, icons)
- also completed data cleanup exercises (removed subreddits with no 'source-subreddit' data, re-normalize the source subreddit set
- worked on the report and video all week





