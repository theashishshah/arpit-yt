# Sharing Databases in Microservices

One of the simplest ways to integrate a couple of microservices is to let them **share a database**. For example: the Blogs service stores published blogs in **Blogs DB**, while the Analytics service also updates the total views a blog got in the same DB. Both services have **read/write (RW)** access to the same database. This is the **simplest approach** to integrate—but it comes with trade-offs.

---

## Advantages of this approach

- **Simplest way of integration** — No extra services or message buses.
- **No middlemen involved** — Services talk to the DB directly.
- **No latency overhead** — No network hop between service and data.
- **Quick development time** — Easy to get something working fast.
- **Simpler operation** — Fewer moving parts to run and monitor.
- **Better performance** — No middlemen; direct DB access.

Apart from all of these advantages, there are a few **disadvantages** to keep in mind.

---

## Challenge 1: External parties get internal details

By sharing a database, an external party (e.g. **Analytics**) gets the **internal schema and implementation details** of the **Blogs** service. That creates coupling and breaks encapsulation.

**What gets exposed:**

- **Schema** — Table structure, column names, types.
- **Design decisions** — e.g. soft delete vs hard delete, normalization, redundancy.

When an external service has direct access to the database, it becomes dependent on those internal choices. The Blogs team loses the freedom to change their data model without coordinating with every consumer of that DB.

---

## Challenge 2: Sharing DB = sharing business logic

Say that to render a particular screen you need data from specific tables: **T1, T2, T3, T4**. The logic to fetch and combine this information is implemented **inside each dependent service** (Blogs, Analytics, Recommend)—each has its own queries and logic against the shared DB.

**Problem:** If the **Blogs** service changes its logic (e.g. which tables it uses, or how data is structured), **all dependent services** that read from the same DB must change their logic too. There is no single owner of “how to get blog data”; the business logic is effectively **shared and duplicated** across teams, leading to tight coupling and coordination overhead.

---

## Challenge 3: Risk of data corruption and deletion

Once all dependent services have **WRITE** access to the same database, the risk of mistakes goes up:

- **Corrupting the data** — Buggy or wrong updates.
- **Wrong script** — A script from one team touching tables owned by another.
- **Limited knowledge** — A team that doesn’t fully understand the schema making changes.
- **Accidentally deleting data** — E.g. a broad `DELETE` or bad migration.

Mitigation requires strict **database ACLs (access control)** and discipline, but in practice it’s hard to enforce when many services share one DB.

---

## Challenge 4: Abusing the shared DB

Imagine the **Analytics** service adds new, **super-heavy** queries to power new user-facing dashboards. Those queries run against the **same** Blogs DB that the Blogs and Recommend services use.

**Effects:**

- Other services are affected because they depend on the same DB.
- There is **no built-in way to throttle** or isolate one service’s queries from another’s.
- One team’s heavy read/write load can slow or starve others, leading to noisy-neighbour problems.

---

## Schema changes and technology lock-in

**If the Blogs service wants to change the schema** (e.g. for better performance or maintainability), the Analytics service (and any other shared-DB consumer) must either:

- Change its logic accordingly, or  
- Rely on the Blogs service to keep changes **backward compatible**.

**If the Blogs service wants to move** from a relational DB to another technology (e.g. document store), it becomes very difficult because other services are tightly coupled to the current DB.

**Result:** The Blogs team **loses autonomy** over their own service and data. They cannot freely evolve schema or technology without coordinating with every team that shares the DB.

---

## When is sharing a DB acceptable?

Given these challenges, does it mean we should **never** share a DB? **No.** There are situations where sharing a DB can be acceptable or even beneficial.

### 1. Quick solution when crunched on time

Sharing a DB can be a **fast** way to ship when deadlines are tight. Doing it properly (clear ownership, contracts, access control) still requires **effort and coordination across multiple teams**, so treat it as a trade-off, not a long-term default.

### 2. When schema (and business logic) rarely change

If the schema and business logic **do not change often**, the pain of coupling is lower. In such stable areas, introducing a separate service and API just to avoid sharing might be unnecessary. Evaluate whether the extra dependency and latency are worth it.

### 3. Read load can be moved to a replica

Heavy analytics or reporting queries can run against a **separate read replica** of the database. That way:

- The primary DB stays dedicated to transactional, low-latency workload (e.g. Blogs and Recommend).
- Analytics (or similar) use the replica, reducing impact on other services.

This doesn’t remove the shared-DB coupling entirely, but it **mitigates** Challenge 4 (abuse and noisy neighbours) by isolating heavy read load.

---

## Summary

| Aspect | Shared DB |
|--------|-----------|
| **Integration** | Simplest; direct RW access. |
| **Pros** | Fast to build, no middlemen, lower latency, simpler ops. |
| **Cons** | Exposed internals, shared business logic, coupling, risk of corruption/deletion, no query isolation, loss of team autonomy. |
| **When to consider** | Short-term or when schema is stable; use replicas for heavy read load where possible. |

For long-term, scalable microservices, **database per service** (each service owns its DB and exposes data via APIs) is usually the preferred direction; sharing a DB is a pragmatic compromise to use knowingly, not by default.
