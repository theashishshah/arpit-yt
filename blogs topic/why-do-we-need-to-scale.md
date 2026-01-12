# what is the reason that we need to scale our applications?

Every request consumes multiple shared resources, not just CPU.

when we serve a client's req, if we can find out what are the resource a server uses/needs to serve the client's request and does it require time to serve a request and before serving 1st req, second req comes? then here we can easily find out what is bottleneck and why we need to scale our system.

re-write:
We need to scale applications because requests consume finite resources for finite time, and when arrival rate > service capacity, requests start queueing, timing out, or failing. Scaling is not about ports or code elegance — it’s about physics: CPU cycles, memory, I/O bandwidth, network sockets, locks, and time.
