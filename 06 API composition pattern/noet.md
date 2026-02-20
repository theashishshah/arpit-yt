# API composition pattern

**What it is:** A backend pattern where one API (the *composer* or *BFF*) calls multiple downstream services and combines their responses into a single response for the client. Instead of the client calling three APIs, the client calls one; the server fans out to the others and composes the result.

**Why use it:** Reduces round-trips and complexity on the client, keeps service boundaries clear, and lets you tailor the response shape (e.g. for a specific screen or frontend). The “heavy” work (multiple calls, aggregation) happens on the server.

**Fan-out:** The composer fires several requests (in parallel when possible), waits for all results, then merges and returns. That’s the “fan-out” — one request in, many internal calls out.

**In JS:** You implement the composer as a normal API (e.g. Express/Fastify route or serverless function) that uses `Promise.all()` (or similar) to call other services, then maps/merges the responses and returns JSON.

---

# Everything is packet
- If I fire three API request concurrent, they would to my cloud in the form of packet, process it and then response comes to to client. It is heavy computation task.

# Fan out pattern
# how can I write composer or are there API in JS