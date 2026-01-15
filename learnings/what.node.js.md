#### What happens internally that we need to scale up our system?

#### What are the things that creates bottleneck for an application to handle a request?

##### What happnes internally when I make a request to a node.js application?

-   when client make a request let's say localhost:3000/healthcheck
-   this request goes to OS first and as my application is running on port 3000 then my OS knows that ok some application is running on this port
-   socket is created for this request
-   now client's request goes to actuall js code that will run line-by-line and if there is any async task then code pause and let assume another request comes in then it will do the same and let say again there is a async task that pauses for a while
