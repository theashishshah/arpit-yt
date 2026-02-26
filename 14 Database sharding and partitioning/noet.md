# Database sharding and partitioning

**Quick definitions**

- **Sharding** = method of **distributing data across multiple machines** (each machine/servers is a “shard”).
- **Partitioning** = **splitting a subset of data** (e.g. within one instance or across shards). You partition the *data*; you shard the *database*.

In practice many people use “sharding” and “partitioning” interchangeably; technically: **the database is sharded, the data is partitioned**.

---

## How is a database scaled?

A database server is just a **process** (`mysqld`, `mongod`, etc.) running on a machine (e.g. EC2). We often draw it as a single cylinder (DB).

**Initial production**

```
  User  ──────►  API Server  ──────►  [ DB ]   ← 100 WPS
```

You put your DB in production serving real traffic (e.g. 100 WPS). When you get more users and the DB can’t keep up, the first step is usually:

- **Scale up (vertical scaling)**: give the same server more CPU, RAM, disk → “bulkier” server.
- **Add a read replica**: same data, extra copy for **reads** only. Writes still go to the primary.

```
  User  ──────►  API Server  ──────►  [ Primary DB ]  200 WPS (bulkier)
                              └────►  [ Read Replica ]
```

So: **bulkier server + read replica** → more read capacity and some write headroom.

---

## When vertical scaling isn’t enough

Your product goes viral; even the bulky DB can’t handle the load. You scale up again, but **vertical scaling has a limit** (hardware ceiling, cost).

Example: one DB was handling **1000 WPS**, you can’t scale up further, but you’re getting **1500 WPS**.

So you have to **scale horizontally** and **split the data** across more than one database server.

```
  User  ──────►  API Server  ──────►  [ Shard 1 ]  50% data, 750 WPS
                              └────►  [ Shard 2 ]  50% data, 750 WPS
```

By adding another database server and splitting the data:

- Load per node drops (e.g. 750 WPS each).
- Total throughput increases (e.g. 1500 WPS total).

---

## Shard vs partition (visual)

- Each of those database servers is a **shard**.
- The way the data is divided across them is **partitioning**; we say the data is **partitioned** (split across shards).

So:

- **Database** → sharded (multiple DB servers).
- **Data** → partitioned (split into disjoint subsets).

(Many say “partitioned” for both; the idea is “split across”.)

**Partitioning the data (conceptually)**

Imagine 100 GB total. You partition it into **exclusive** chunks, e.g.:

```
         [ 100 GB total ]
                  │
    ┌─────────────┼─────────────┬──────────┬──────────┐
    ▼             ▼             ▼          ▼          ▼
 [ 30 GB ]   [ 10 GB ]   [ 30 GB ]   [ 20 GB ]   [ 10 GB ]
    A            B            C           D           E
```

Those chunks are **partitions**. They can then be placed on different shards, e.g.:

- **Shard 1**: partitions A (30 GB) + C (30 GB) → 60 GB.
- **Shard 2**: partitions B (10 GB) + D (20 GB) + E (10 GB) → 40 GB.

So: **5 partitions** of a 100 GB dataset **distributed across 2 shards**.

---

## How to partition the data? Horizontal vs vertical

When you “split” the 100 GB (or any dataset), you choose *how* to split. There are two main **categories of partitioning**:

1. **Horizontal partitioning** (often what people mean by “sharding”)
   - Split **rows**: different rows (different records) go to different shards.
   - Example: user_id % 2 → shard 1 vs shard 2.

2. **Vertical partitioning**
   - Split **columns**: different tables or column groups live on different shards (or different storage).
   - Example: put “user profile” on one shard and “user activity log” on another.

Which one to use depends on **load**, **use case**, and **access pattern** (e.g. how you query, what’s hot).

---

## Advantages of sharding

- **Handle large reads and writes** – spread load across many nodes.
- **Increase overall storage capacity** – more disks, more data.
- **Higher availability** – one shard failing doesn’t take down the whole dataset.

---

## Disadvantages of sharding

- **Operationally complex** – more nodes, rebalancing, monitoring, backups.
- **Cross-shard queries are expensive** – data lives on different machines; joins/aggregations across shards are hard and slow. Often avoided or done in application layer.

---

## Summary (visual recap)

| Stage              | What you do                    | Picture in mind                    |
|-------------------|--------------------------------|------------------------------------|
| Single DB         | One process, one machine       | User → API → [ DB ]                |
| Scale up          | Bigger machine + read replica  | User → API → [ Primary ] + [ Replica ] |
| Scale out         | Split data across DBs          | User → API → [ Shard1 ] + [ Shard2 ]   |
| Terminology       | DB = sharded; data = partitioned | Partitions live on shards          |
| Partitioning type| Horizontal (by row) or vertical (by table/column) | Depends on load, use case, access pattern |

So: **sharding** is about distributing the **database** across multiple machines; **partitioning** is about how you **split the data** (and that split is implemented across those shards).
