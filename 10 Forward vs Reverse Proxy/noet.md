
# Forward vs Reverse Proxy

A **proxy** is a machine (or set of machines) that sits **in between two systems** and forwards requests and responses. It can sit between:

- Two services, or  
- A user/client and a system.

Proxy servers are usually installed to **abstract out the complexities** or to protect systems in an **untrusted environment**.

---

## Forward proxy

A **forward proxy** sits **in front of the client** and hides or abstracts the client from the outside world.

- Clients send their requests **to the proxy first**.  
- The proxy then forwards the request to the internet / untrusted network on their behalf.  
- External systems mainly see the **proxy’s IP**, not the actual client.

### Why we need a forward proxy

- **Security & privacy**: protects the client’s identity and IP.  
- **Access control**: organizations can restrict or log which external systems users reach.  
- **Caching**: cache responses from external sites to speed up repeated requests and save bandwidth.  
- **Centralized logging/monitoring**: one place to observe outgoing traffic.

In short: **forward proxy = client-side middleman**.

---

## Reverse proxy

A **reverse proxy** sits **in front of servers** and hides the complexity of the **downstream systems**.

- Clients send requests to the **reverse proxy endpoint**.  
- The reverse proxy forwards each request to one of many backend services/instances.  
- From the client’s view there is just **one server**; the reverse proxy deals with routing and fan-out.

### Why we need a reverse proxy

- **Load balancing**: spread incoming traffic across multiple backend instances.  
- **Security**: single entry point for TLS termination, authentication, WAF rules, rate limiting, etc.  
- **Central features**: logging, compression, header manipulation.  
- **Caching static responses**: avoid calling downstream systems for repeat requests.  
- **Abstracting infrastructure elasticity**: hide auto-scaling and dynamic backend topology behind one stable endpoint.

In short: **reverse proxy = server-side façade** for many downstream systems.

---

## Examples of proxies

Common proxy-like components:

- **Load balancers**  
- **API gateways**  
- **Database proxies**

Popular tools that act as forward or reverse proxies:

- `Nginx`  
- `HAProxy`  
- `Kong Gateway`  
- `ProxySQL` (DB proxy)

---

## Database proxy (special case)

A **database proxy** is a proxy that sits between applications and a database (or database cluster). It can:

1. **Cache responses** for certain queries to reduce load on the DB.  
2. **Pool connections** to the database so many app requests share a smaller set of DB connections.  
3. **Abstract out database topology** (read replicas, failover, sharding).  
4. Provide **elasticity** and centralized routing (e.g. reads to replicas, writes to primary).

---

## Summary

- **Forward proxy**: in front of clients; hides clients and manages outbound traffic.  
- **Reverse proxy**: in front of servers; hides downstream systems and manages inbound traffic.  
- Both insert a smart middle layer, but they differ in **whose side they represent** (client vs server).


