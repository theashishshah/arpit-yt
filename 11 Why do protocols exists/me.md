Why protocols exist in the first place? 
- without protocols, we first make the TCP connection to the server by three-way handshaking mechanism.
- and then pass the data in the raw way, and server has to parse it because it receive stream of byts rather than actual message.
- and server process the data
- sends back to client and client has to parse the streams of bytes in order to understands server's response.


but after introducing protocols, first still client has to make a raw TCP request but now this time client has a format to send the data instead of sending raw bytes and server understands it from the client because it knows what to expect from the client.





# why on top of tcp suite, there is protocols like HTTP, WS, gRPC, SMPT? why do we require them in the first place? 
- because it formats the data the which you want to send, they doesn't do anything instead formating the data that client and server both know.


Application Layer  →  HTTP, WebSocket, SMTP, etc. [formats the data]
Transport Layer    →  TCP / UDP [ creates the connection]
Internet Layer     →  IP [ route the packets]
Link Layer         →  Ethernet / WiFi [ connects to router/switch because switch knows only MAC address]