## What actuall socket is? how two processes communicate to each other?

### if you can understand this, then you can easily understand how when you login into amazon.com, how your data is sends to server, how server handles data, what thing cause to scale a system: horizontal or vertical scalling?

## if you understand what is actually http is and how does it work then you'll easily get to know about websocket and why do we require it

-   if you understand how two processes talk, what are the resources they consume when they talk then you can easily get the bottleneck of the system and scale up/down the system.
-   you'll understand why at diwali sale time amazon scales it system.

http defines structure, tls encrypts it and tcp as it just job is to deliver the streams, right?

as you can see i've created two socket who are communicating to each other, right now they are on local machine so there isn't any problem of security or vulnerability, right? but how two different process can communicate each other who are on different machine because ultimately two process are communicating, right? lets' say i'm opening amazon.com and when clicking on login and then i'm sending my data to server process with secure connection and there am taking data and computing and verifying and then again sending back to this process, this is how things are working right? at low level

```arduino
for same machine:

Process → socket → kernel → socket → process

for different machines:
Process A
  ↓
Socket (fd) (file descriptor)
  ↓
Kernel TCP stack
  ↓
Network card
  ↓
Internet (routers, switches)
  ↓
Network card
  ↓
Kernel TCP stack
  ↓
Socket (fd)
  ↓
Process B

```

[how socket works chatGPT chat](https://chatgpt.com/share/6965529d-177c-8000-9161-a8103233e86c)

ok when i'm doing nc -l 3000 it is creating a server, right? and when i'm doing nc localhost 3000, it is becoming client, how can 3001 become client as well so when my server sends data both can get data and how other types of file i can transfer and how? and also why am i allowed to do one nc localhost 3000 only not 3004 or 3005

6️⃣ Where HTTPS fits (important but clean)
HTTP → TLS → TCP → IP

HTTP defines structure
TLS encrypts bytes
TCP delivers bytes

TLS does not understand HTTP.
TCP does not understand HTTP.
Only the application does.

7️⃣ How browsers automate all this

When you do:

fetch("/login")

The browser:
Builds HTTP text
Encrypts it (TLS)
Writes bytes to socket (TCP)
Reads response bytes
Parses HTTP
Gives you JS objects
Frameworks just hide steps 1–5.

### why http is defined like this while under the hood it usese TCP which is duplex:

HTTP was designed as:
Client → Request
Server → Response
(connection usually closes)

Even with HTTP/1.1 keep-alive:
Client must initiate every request
Server cannot push data freely
Real-time apps (chat, trading, games) suffer

Hacky solutions existed:
polling:
long-polling
They suck.
