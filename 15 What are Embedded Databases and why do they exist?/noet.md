# What are Embedded Databases and why do they exist?

---

## Server-based databases (traditional)

In the usual setup, the **database is a separate process** running on a server, on top of an operating system (e.g. Ubuntu). Multiple API servers talk to this single database over the network.

```
  User  ◄────►  API  ◄────►  [ Database ]
         ◄────►  API  ◄────►      │
                                  ▼
                            MySQL (port 3306)
                            $ mysqld --port 3306
```

- Anyone who wants to talk to the DB connects through a **network port** (e.g. MySQL on 3306).
- The database is its own process; clients connect to that process, not directly to files or the OS.

---

## Embedded databases

An **embedded database** lives **inside the application process**. It is not a separate server; it runs as a library within your app.

**Key idea:** Clients **cannot directly connect** to the embedded database. They talk to your application; the application uses the embedded DB internally.

```
  Client  ──────►  [ Application (e.g. Profile Service) ]
                         │
                         │  embedded DB inside
                         ▼
                    [ Key-Value store / SQLite / etc. ]
```

**Example:** A profile service caches frequently accessed profiles in an in-memory hash table. That cache could be backed by an embedded DB.  
**Note:** Embedded DBs need not be in-memory; they can persist to disk (e.g. SQLite, LevelDB).

---

## Some embedded databases

| Database    | Description                                      |
|------------|---------------------------------------------------|
| **SQLite** | Embedded SQL database                             |
| **LevelDB**| On-disk key-value store by Google                  |
| **RocksDB**| On-disk KV store optimized for performance        |
| **Berkeley DB** | KV store with ACID, locking, replication   |

**Definition:** An embedded DB is designed to **solve one niche really well** — lightweight, no separate server, minimal setup.

---

## Applications of embedded databases

### 1. Browsers and mobile

- **Browsers** use **IndexedDB** as an embedded database (client-side storage).
- **Mobile phones** commonly use **SQLite** for local app data.

### 2. Building a partitioned key-value store

If you want to build your own partitioned KV store:

- Use an **embedded KV DB** (e.g. LevelDB, RocksDB) inside each partition.
- Flow: Client → `put(K₁, V₁)` → DB Proxy → `hash(K₁)` → routes to the right DB API instance → that instance uses its embedded DB to store the key-value pair.

Each partition runs your app logic + an embedded DB; no separate DB server per partition.

### 3. Querying structured data in a bounded space

If you need to **query data that lives in a specific space** (e.g. a file, a device, an app):

- Use an **embedded database** for structured storage and queries.
- Avoid hacky raw file I/O — embedded DBs give you indexing, transactions, and a clear query model.

---

## Why do they exist?

- **No separate server** — no network hop, no port to manage, no DB process to deploy.
- **Lightweight** — runs inside your process; good for apps, devices, and edge cases.
- **Focused** — each one targets a niche (SQL, KV, high write throughput, etc.).
- **Simpler ops** — no DB cluster to run; your app and its data stay together.
