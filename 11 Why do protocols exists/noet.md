# Why do protocols exist? (HTTP as an example)

When two machines \(A\) and \(B\) are connected on a network, they can establish a **TCP connection** between them. TCP lets them send bytes reliably, but it **does not say what those bytes mean**.

For device B to understand what device A is talking about, they need a **common language** on top of TCP. That common language is called a **protocol**.

---

## Defining a simple custom protocol

Imagine we design a tiny protocol for a calculator server that can do `ADD` and `SUB`.

We define this **specification (protocol)**:

1. Message is **space separated** text.  
2. **First word** is the command (e.g. `ADD`, `SUB`).  
3. **Subsequent words** are arguments (e.g. numbers).  
4. The **response** is a single word: the result.

Example:

- Client → Server: `ADD 2 3\n`  
- Server → Client: `5\n`

As long as **both sides follow this spec**, they can understand each other. This is exactly what a protocol is: **an agreed set of rules for how to format, send, and interpret messages**.

---

## HTTP as a protocol

HTTP is another protocol built on top of TCP where:

1. The **client asks** for something from the server.  
2. The **server responds** with a message.

But how does the client “ask”? In HTTP, the **requests and responses are encoded as text messages**.

Example HTTP request line:

```http
GET /foo HTTP/1.1\r\n
```

This is literal text sent over TCP to the server. A server is a **web server** only if it understands the HTTP protocol—i.e. it knows how to **parse and interpret** this text according to the spec.

---

## HTTP headers and body

In HTTP, a message has:

- A **start line** (request line or status line).  
- **Headers** (key–value metadata).  
- An optional **body** after an **empty line**.

The **body** is the data you send after that empty line (HTML, JSON, etc.).

The server cannot wait forever for the body, so the client is required to send a **`Content-Length` header**:

- `Content-Length` tells the server how many bytes of body to read.

If the client also sends a **`Content-Type` header**, the server knows **how to interpret the body** (e.g. `application/json`, `text/html`). These headers and their meanings are all part of the HTTP specification.

---

## You can define your own protocol

You are free to design your own protocol, as long as:

1. The **client** knows how to **format and send** the messages.  
2. The **server** knows how to **interpret and respond** to those messages.

For example, Redis defines its own protocol called **RESP** for talking to the Redis server.

HTTP, on the other hand, became a **standard protocol** used by browsers and servers everywhere.

---

## How this ties back to the browser

Because HTTP is standardized, when a browser makes a call to a URL it knows it must:

1. **Establish a TCP connection** with the server.  
2. **Send the request as an HTTP-spec message** (start line, headers, body).  
3. **Receive the HTTP response**, parse it using the same spec.  
4. Use the parsed data to **render** something in the UI.

Protocols exist so that **independent programs and machines can communicate reliably**, as long as they all follow the same agreed-upon rules.

