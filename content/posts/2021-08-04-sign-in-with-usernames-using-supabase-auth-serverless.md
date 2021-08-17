---
template: post
title: Sign In With Usernames Using Supabase Auth + Serverless
slug: supabase-auth
socialImage: /media/supabase.png
draft: false
date: 2021-08-04T19:26:18.633Z
description: Learn how to authenticate users with usernames using Supabase Auth
  and Serverless
category: Web Development
tags:
  - Web Development
  - Supabase
  - Serverless
---
Supabase Auth supports many different authentication options, like email, phone, or OAuth with Google. However, signing in with your username is a different story since Supabase (and other similar services like Firebase) don't natively support username sign up. You'll have to implement your own identity provider using a trusted backend environment. Email, phone, or another provider is still required since one of those is needed to create a user in Supabase Auth (and it wouldn't be very secure to have only username + password). At the time of writing this article, Supabase has not yet launched Supabase Functions, so I'll be showing you how to use the [Serverless Framework](https://www.serverless.com/) to host a serverless Node.js REST API. Serverless uses AWS Lambda functions under the hood, so you can use AWS Lambda directly if you're familiar with that. You can also use an alternative like Firebase Cloud Functions.

Disclaimer: You don't necessarily need a serverless function - it just makes sense to use since Supabase acts as a backend service already so an entire server for a couple of features seems overkill. When Supabase Functions launches later on, you could probably migrate most if not all of the logic you implemented already. If serverless doesn't meet your demands, you can definitely host a server to do the exact same thing.

You might be wondering - why can't you just authenticate on the frontend by having the user input a username and password, checking to see if a user has that username, and attempting to sign in with those credentials? Well, that would raise a significant security concern since the user would technically be able to find out a user's email and other information with just a username. Thus, we'll need a trusted backend environment like a serverless function to handle part of this logic for us.

In this post, we'll be using Node.js for our backend. This project assumes that you have a Supabase project created, with a table containing a `username` field. Using one of Supabase's auth starters with a little bit of modification will work.
# 1. Set up Serverless
You'll first need to install the serverless CLI with:
```shell
npm install -g serverless
```
Create a new serverless project with:
```shell
serverless
```
You'll be prompted with a list of starter projects. Select AWS - Node.js - Express API. A directory will be created for the project. Change your current directory to the one created with `cd <project-name>`.

# 2. Set up Supabase
Create your Supabase project if you haven't already. You'll need the Supabase project URL Supabase anon/public API key and to create the Supabase client.

You'll need to install the Supabase JavaScript client with:
```shell
npm install @supabase/supabase-js
```

Add the following to  `handler.js`, where SUPABASE_URL is your Supabase project URL found under Config and SUPABASE_ANON_KEY is your Supabase anon/public API key found under Project API keys:
```diff
+ const { createClient } = require("@supabase/supabase-js");
const serverless = require("serverless-http");
const express = require("express");

const app = express();

+ const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)



app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
```
I would recommend you to include SUPABASE_URL and SUPABASE_ANON_KEY in an `.env` file as to not expose credentials to version control, but it can be a little complicated to set that up, so we won't do that in this post.

# 3. Add the login endpoint
You'll want to create an endpoint for the user to send a request to. Here, I have an endpoint that looks for two parameters: `username` and `password`. 
```js
app.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const { data } = await supabase.from("users").select().eq("username", username));


  if (data.length > 0) {
    const { session, error } = await supabase.auth.signIn({
      email: data[0].email, // phone also works here -> phone: data[0].phone
      password,
    });
    if (!error) {
      return res.status(200).json({
        refreshToken: session.refresh_token,
      });
    }
  }
  return res.status(404).json({
    message: "Invalid username or password",
  });
});
```
This `/login` endpoint checks if there's a user with the provided username, and if so, attempts to sign in with the email (or phone) of that user and the provided password. If it succeeds, the function will send a refresh token back to the client and the client can then use that token to login.

To deploy the Serverless function, run `serverless deploy`.

# 4. Login with the refresh token on the client
I won't be providing much code for the rest of the client, but here's what it might look like when using the `/login` endpoint:
```js
try {
  const response = await axios.post(
    "https://<SERVERLESS-PROJECT-HASH>.amazonaws.com/dev/login",
    {
      username,
      password,
    }
  );
  if (response.status === 200) {

    await supabase.auth.signIn({
      refreshToken: response.data.refreshToken,
    });
  } else {
    console.log("Invalid username or password!");


  }
} catch (error) {
  console.error(error);
}
```
Note that you'll need to get the Serverless function's URL and replace the URL above with it.

## Conclusion
Now you know how to set up (partial) username authentication with Supabase Auth! Full username authentication is not recommended, but if you need to use username-only authentication, then instead of using Supabase Auth you would store the username and hashed password in a private table, and check against those values.
