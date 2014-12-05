Still working through how this will look. Initially I am going to get Gitlab and Redmine talking to one another, later on I plan to integrate jenkins builds.


Currently, you can submit a post from gitlab's web hooks to http://myhost/sc/[redmine project identifier]/[user account api key]
This will accept a post commit hook from gitlab and update issues in the commit messages denoted by # followed by up to 8 numbers like "#12345678"
It will go through all of the commit messages in the push, looking for ticket numbers, then update those tickets with the commit message in a format like:

Commit: fcc2fd1d57a61d75b64d212ed56c040903b76612
Message: How well does this work #2376
Author: Eric Sabelhaus
