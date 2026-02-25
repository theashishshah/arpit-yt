# What happens when you type a URL in your browser?

When you type a URL like `https://www.google.com` in the browser and hit enter, a lot happens behind the scenes. It is not a single call, but a sequence of steps involving many machines and protocols.

---

## 1. DNS lookup – finding the server’s IP

- **Goal**: Convert the human-friendly hostname (e.g. `www.google.com`) into an IP address the network can use.
- The **browser asks the OS** for the IP.
- The OS (or browser) checks multiple **caches** first:
  - Browser cache  
  - OS cache  
  - Local network / ISP DNS cache  
- If not found in cache, a **DNS server** is queried, which may itself talk to other DNS servers (root, TLD, authoritative) before returning the IP.

Result: the browser now knows something like `142.250.x.x` for `www.google.com`.

---

## 2. Establishing a TCP connection

After DNS resolution, the browser has the server’s IP and can connect.

- The browser initiates a **TCP connection** to the server’s IP (and port 80 for HTTP or 443 for HTTPS).
- This involves a **handshake** (multiple network round trips) to agree on how to communicate.
- Behind that IP, there might be a **load balancer** and thousands of machines running many services, but from the browser’s view it is just one endpoint.

Once TCP is established, the browser can send data reliably over this connection.

---

## 3. Sending the HTTP request

Now the browser turns your action into an **HTTP request** and sends it over the TCP connection.

- For a normal page visit, it typically sends an **HTTP GET**:

  ```http
  GET /search?q=home HTTP/1.1
  Host: www.google.com
  Connection: keep-alive
  ```

- The browser fills in:
  - **Method** (`GET`, `POST`, etc.)
  - **Path + query** (e.g. `/search?q=home`)
  - **Headers** (e.g. `Host`, cookies, user agent, etc.)

HTTP is the **protocol** that defines:

- How to format (pack) the request and response.
- What metadata (headers) looks like.
- How clients and servers should behave around these messages.

---

## 4. Server processes the request

Once the server receives the HTTP request:

- It **parses** the request line and headers to understand what you are asking for.
- Depending on the endpoint, it may:
  - **Serve a static file** from disk.
  - **Call application code**, which might query a database or other services.
  - **Validate** the request and possibly return an error if malformed or unauthorized.
- It then compiles an **HTTP response** with:
  - **Status line** (e.g. `HTTP/1.1 200 OK`)
  - **Headers** (e.g. `Content-Type`, `Content-Length`)
  - **Body** (HTML, JSON, image bytes, etc.)

This response is sent **back over the same TCP connection** to the browser.

---

## 5. Browser receives the response and renders

When the browser gets the HTTP response:

- It reads the **status code** (`200`, `404`, `500`, …).
- It checks **headers**:
  - `Content-Type` – what kind of content this is (`text/html`, `image/png`, `application/json`, …).
  - `Content-Length` – how many bytes to expect, etc.
- Based on `Content-Type` it decides what to do:
  - For `text/html`, it **parses and renders** the HTML into the page.
  - For CSS, JS, images, it may download and process them.
  - If it doesn’t know how to display the type, it may **download** the file instead.

Rendering HTML can itself trigger **more requests** (for CSS, JS, images, fonts, APIs), each going through the same DNS → TCP → HTTP → response flow.

---

## (Bonus) What constitutes a URL?

A URL like `https://www.google.com/search?q=home#top` is made up of parts:

- **Scheme**: `https` (how to talk – protocol).
- **Host**: `www.google.com` (which server).
- **Path**: `/search` (which resource/endpoint).
- **Query string**: `?q=home` (extra parameters).
- **Fragment**: `#top` (in-page location, used by the browser, not sent to the server).

Typing this URL kicks off all the above steps under the hood.
