# Data in HTTP GET request payload

We are usually told that we **cannot** send data in an HTTP `GET` request body. The real story is more subtle.

---

## What HTTP spec says about GET bodies

- The modern HTTP/1.1 specification (RFC 7231 and later) **does not forbid** a `GET` request from having a message body.  
- Earlier specs had a note saying that the **message-body should be ignored while handling GET requests**; this wording has been removed.

So, from a pure **protocol** point of view, sending a body with `GET` is **allowed**.

---

## Why many servers ignore GET bodies

Even though the spec allows it, popular web servers and frameworks (e.g. `express`, many HTTP servers) are **implemented in such a way that they ignore the payload of a GET** by default.

Reasons:

- **Conventions and expectations**: by convention, `GET` is used to fetch data and all parameters are expected in the **URL path or query string**, not in the body.  
- **Caching and proxies**: many intermediaries cache `GET` requests assuming that the URL fully describes the request; a body breaks that assumption.  
- **Interoperability**: not all servers, libraries, or tools handle GET bodies consistently.

Because of this, when you use a predefined server like Express/Node `http`, sending a body in `GET` **may be ignored** even though TCP still carries those bytes.

---

## Real-world example

Some systems did historically use `GET` bodies. For example:

- Earlier versions of **Elasticsearch** allowed sending complex JSON search queries in the **body of a GET** request.

This practice is now **discouraged**, and most examples have moved to using `POST` or putting parameters in the query string.

---

## Can we do it vs should we do it?

- **Can we send a body in GET?**  
  - **YES** — the HTTP spec does not prohibit it.

- **Should we send a body in GET?**  
  - Generally **NO** — it is **not recommended** because:
    - Many servers/frameworks ignore it.  
    - It confuses caches and intermediaries.  
    - It violates common expectations that `GET` is **idempotent and fully described by the URL**.

Recommended practice:

- Keep `GET` for **safe, idempotent reads** where all input is in **path/query**.  
- Use `POST`, `PUT`, etc. when you need to send a **request body** with JSON or other complex data.
