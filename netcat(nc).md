#### How does this work internally? how two process communicate to each other

1. on the same machine: 
    - nc -l port (create a server, socket() is created by OS, waiting for TCP handshake)
    - nc localhost/127.0.0.1 (same port) (creates a client, socket() is also created because socket has send and recieve buffer, TCP handshake with server) 
    - TCP is full duplex because both has send and recieve buffer, so both way they can send data

2. Same thing on different machine:
    Nothing changes except the IP address.

    ```go
        // local machine
        127.0.0.1 → loopback interface
        (no physical network)

        // on different machine:
        192.168.x.x / public IP
        (real NIC, routers, internet)

        flow ->
        Process → socket → kernel TCP → network → kernel TCP → socket → process

    ```
    ```go
    // in tcp always server is running: and client want to connect
    Server: ncat -l 3000
    Client: nc <server-ip> 3000 // I'm a client and I want to connect to a server that is listening to this port and has a IP address of this

    /* What the client OS actually does (step-by-step)
    Internally, client OS does this:
    1. Create a socket
    2. Pick a free ephemeral port (e.g. 53422)
    3. Bind locally to:
        client-ip : 53422
    4. Connect to:
        server-ip : 3000
    So the real connection is: 
        (client-ip : 53422)  →  (server-ip : 3000)
    */

    //A TCP connection is uniquely identified by this 4-tuple: (source IP, source port, destination IP, destination port)

    ```