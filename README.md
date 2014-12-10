# Prestige
A Server designed to connect distributed applications via their REST API


## The Gist... for now
Still working through how this will look. Currently, Gitlab talks to Redmine, updating issues based off commit messages in a post commit hook. I am going to start working on getting Gitlab to talk to Jenkins, and start a build on a particular job based off a post commit hook.

## About
Currently, you can submit a post from gitlab's web hooks to:

* `http://myhost/sc/tracking/[redmine project identifier]/[user account api key]`

This will accept a post commit hook from gitlab and update Redmine issues in the commit messages denoted by: `#12345678`

It will go through all of the commit messages in the push, looking for issue numbers, then update those issues with the commit message in a format like:
```
Commit: fcc2fd1d57a61d75b64d212ed56c040903b76612
Message: How well does this work #2376
Author: Eric Sabelhaus
```

## Configuration
In the config directory, there are two json files,
`/config/app.json.example`, and `/config/prestige.json.example`.

App dictates the hostname, port, and whether you are using SSL for inbound traffic (I am going to implement this later, sorry)

Prestige dictates how the different app files operate. For now, the only nested object in `prestidigitation` that matters is tracking (short for issue tracking). the only required field is really the `host`. If you use SSL on your redmine server, you must specify all of the ssl fields properly, and the user running prestige must be able to access these files.

## The Prestige

### install
`npm install prestige`

### start
`grunt start`

## issues
https://github.com/e-sabelhaus/prestige/issues
