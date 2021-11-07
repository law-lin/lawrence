---
template: post
title: Send Transactional Emails With Your Own Mail Server Using Postal
slug: postal
socialImage: /media/image-1.jpg
draft: false
date: 2021-11-07T07:16:42.609Z
description: Learn how to set up your own mail server to send transactional emails using Postal
category: Web Development
tags:
  - Web Development
  - Services
  - Postal
---

If you’re developing an application, you may find the need to send transactional emails (an email sent to someone after some trigger in the app). You can utilize services like SendGrid or Mailgun to do so, but if you want full control over your data or prefer using an open source solution, then hosting your own mail server is the way to go.

In this article, we’ll be using Postal, a full-featured open source mail server. Note that we will be installing Postal v1. If you want to use Postal v2, you can find the full documentation at [https://docs.postalserver.io/](https://docs.postalserver.io/).

## Prerequisites

To get started, you will need:

- A dedicated server (virtual or physical)
- [Docker](https://www.docker.com/) and Docker Compose
- A domain name you can host the mail server with

If you don't have a dedicated server yet, you can set one up using a virtual private server (VPS) provider like DigitalOcean, Linode, or Vultr. You can read the provider's respective documentation to learn how to do so. Alternatively, you can set up a dedicated server on a physical machine like a PC or a Raspberry Pi, but that assumes how-to knowledge. You can look online for resources on how to do so if you prefer a physical server, but a virtual server is more recommended.

## Installation

1.  Connect to your dedicated server.
2.  Clone the repository hosted at [https://github.com/ILoveYaToo/docker-postal](https://github.com/ILoveYaToo/docker-postal).
3.  Run `cd docker-postal/alpine` to change the working directory.
4.  Run `vim docker-compose.yml` or open the file in another text editor.
5.  You should replace the following fields with your desired values:
    - MYSQL_ROOT_PASSWORD
    - RABBITMQ_DEFAULT_PASS
    - POSTAL_FNAME
    - POSTAL_FNAME
    - POSTAL_PASSWORD
    - POSTAL_EMAIL
    - Feel free to change the other properties as you see fit.
6.  We will be utilizing port 5000. Add `5000:5000` under the `ports` field in `docker-compose.yml` (to map the container's port 5000 to the host's port 5000) and expose ports 25 and 80 in `Dockerfile`, e.g.

```yml
# docker-compose.yml
ports:
    - 127.0.0.1:25:25
    - 5000:5000

# Dockerfile
EXPOSE 5000
EXPOSE 25
EXPOSE 80
```

7. Run `docker-compose up -d` to build and start the containers in the background.
8. Run `docker-compose run postal start` to initialize the Postal server.
9. You should now be able to access the Postal interface at `http://<server-ip-address>:5000`, where `server-ip-address` is the IP address of your dedicated server.

## Setting Up The Server and API

1. Log into the Postal interface with the email you set for `POSTAL_EMAIL` and password you set for `POSTAL_PASSWORD`

![Postal Login](https://cdn.discordapp.com/attachments/649465713303486508/902355569195778068/postallogin.PNG)

2. Create a new organization. Use any name you'd like.

<img src="https://cdn.discordapp.com/attachments/649465713303486508/902355567392223302/postalorg.PNG" alt="Postal Organization" height="200"/>

3. Create a new server in the organization. Use any name you'd like. You should choose "Live" as your mode, unless you don't want to have any emails sent from your server just yet.

<img src="https://cdn.discordapp.com/attachments/649465713303486508/902355559876022302/postalserver.PNG" alt="Postal Server" height="200"/>

4. Navigate to the "Domains" tab and create a new domain. Enter in the domain name that you would want the emails to be sent from (e.g. for noreply@example.com, example.com is the domain).

<img src="https://cdn.discordapp.com/attachments/649465713303486508/902359133838274610/postaldomain.PNG" alt="Postal Domain" height="200"/>

5. Click on the domain just created and follow the on-screen instructions to add the SPF and DKIM records to your domain registrar. You do not need to add the Return Path or MX record.

6. Once the records are added, click on the "Check my records are correct" to verify if the records are added.

![Postal Check Records](https://cdn.discordapp.com/attachments/649465713303486508/902362571175264256/unknown.png)

You should see two green check marks for SPF and DKIM back in the Domains page:

![Postal Record Checkmarks](https://cdn.discordapp.com/attachments/649465713303486508/902359140968570940/postaldomainverify.PNG)

7. Navigate to the "Credentials" tab and create a new credential.

8. Change the type to "API" and give any name you'd like. You should have "Process all messages" for the Hold.

<img src="https://cdn.discordapp.com/attachments/649465713303486508/902359139869671494/postalcredential.PNG" alt="Postal Credential" height="300"/>

9. Click "Create credential" and navigate back to the credential you just created. You should see the automatically generated API key now. Save this key somewhere, since that's what you'll be using to make requests to the mail server.

10. At this point, you have properly set up your mail server to make outgoing transactional emails! Note that this mail server is _not_ set up to receive incoming emails. You'll need to do some additional configuration on your own to do so.

## Sending Emails From the Mail Server via API

We'll be testing our mail server API now using [Postman](https://www.postman.com/).

1. Open Postman.
2. Create a new POST request and in the request URL, enter in: `http://<server-ip-address>:5000/api/v1/send/message` , where `server-ip-address` is the IP address of your dedicated server.

![Postman](https://cdn.discordapp.com/attachments/649465713303486508/902381352933011506/unknown.png)

3. Select the "Headers" tab and add a new header with the key `X-Server-API-Key` and the value of the API key you should have copied from the Postal interface (see step 9 in Installation).

![Postman Headers](https://cdn.discordapp.com/attachments/649465713303486508/902380699212996618/unknown.png)

4. Select the "Body" tab and then select the "raw" radio button. Change the type of "Text" to "JSON" in the dropdown to the right.

![Postman Body Tab](https://cdn.discordapp.com/attachments/649465713303486508/902381970837868564/unknown.png)

5. In the text area, enter in the information like as shown in the picture below. Note that the `to` key is the receiver (you can add multiple receivers by separating each email with a comma), the `from` is the sender (the domain should be the same domain you added to the Postal interface), the `subject` is the email subject, and the `html_body` is the email body. You should replace the `to` with some email you can receive emails from and `from` to the email you are using in Postal.

![Postman Body](https://cdn.discordapp.com/attachments/649465713303486508/902384524825100388/unknown.png)

6. Click "Send" and you should expect a response that looks similar to the below image.

![Postman Response](https://cdn.discordapp.com/attachments/649465713303486508/902384301126082570/unknown.png)

7. Congrats! You have successfully utilized the Postal API to send outgoing emails.

Now all you have to do is make POST requests to the mail server API with the API key from your application to send transactional emails to your users!
