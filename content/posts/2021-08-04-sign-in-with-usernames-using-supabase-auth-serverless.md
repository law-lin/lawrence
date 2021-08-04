---
template: post
title: Sign In With Usernames Using Supabase Auth + Serverless
slug: supabase-auth
socialImage: /media/supabase.png
draft: true
date: 2021-08-04T19:26:18.633Z
description: Learn how to authenticate users with usernames using Supabase Auth
  and Serverless
category: Web Development
tags:
  - Web Development
  - Supabase
  - Serverless
---

Supabase Auth supports many different authentication options, like email, phone, or OAuth with Google. However, signing in with your username is a different story since Supabase (and other similar services like Firebase) don't natively support username sign up. You'll have to implement your own identity provider using a trusted backend environment. At the time of writing this article, Supabase has not yet launched Supabase Functions, so I'll be showing you how to use the [Serverless Framework](https://www.serverless.com/) to host a serverless Node.js REST API. Serverless uses AWS Lambda functions under the hood, so you can use AWS Lambda directly if you're familiar with that. You can also use an alternative like Firebase Cloud Functions.

Disclaimer: You don't necessarily need a serverless function - it just makes sense to use since Supabase acts as a backend service already so an entire server for a couple of features seems overkill. When Supabase Functions launches later on, you could probably migrate most if not all of the logic you implemented already. If serverless doesn't meet your demands, you can definitely host a server to do the exact same thing.


 

