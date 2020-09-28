# sffl
This project has a python django back end( hosted on Apache with mod_wsgi) and a react front end. The server is api based, delivering only json content. Clients are  free to display the content using any UI tech available. This project provides a simple react web front end( not reactive native . For react native, see the events project). The content can be viewed on any standard browser
**Description**

This is a react native project that interacts with a server for registering participants to various events listed.This was an excercise in learning and as such may not be useful to many. I am part of a group that organizes biennial events where all group members meet at some resort and spend  one or two days together. This effort requires registering participants, and arranging for their pick up to and from their point of entry, manging resort reservations etc. This app is used for that purpose. 

**Server functionalities**

Server allows the following actions and responds with JSON data

1.  Register a user
2.  Login registered users
3.  Register for listed events
4.  View media related to events
5.  Upload media related to events

**API Calls**

Root URL: http://ec2-13-232-233-180.ap-south-1.compute.amazonaws.com:8000/client

1.  New User: [Root URL]/events/register
2.  Login   : [Root URL]/events/login
3.  Register: [Root URL]/events/create
4.  View Media: [Root URL]/events/display
5.  Upload Media: [Root URL]/events/upload

