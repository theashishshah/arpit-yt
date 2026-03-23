# Introduction to BitTorrent

> Source: Arpit Bhayani — *Introduction to BitTorrent and the problem it beautifully solves*

---

## What is BitTorrent?

BitTorrent is a **peer-to-peer (P2P) protocol** that makes the distribution of large files:

1. **Easier** — no need for a powerful central server
2. **Faster** — leverages the combined bandwidth of all peers
3. **Efficient** — better utilization of network resources

---

## Classic Download Model & The Need for BitTorrent

In the traditional client-server model:

- A **client requests a file** from the server, and the **server responds** with the file.
- This works fine for small files or a small number of clients.

### Problems arise when:

- There are a **large number of clients**, or
- The file to download is **very large**

### Key Limitations:

1. **Server's bandwidth is limited** — so more clients will slow things down. The server has to divide its upload capacity among all requesting clients.
2. **Speed of data transfer is limited by the upload capacity** of the sender.

### Example:

> If User B's upload speed is **60 Mbps**, then **no matter** what User A's download speed is, the overall download speed **cannot go beyond 60 Mbps**.

This is a fundamental bottleneck in the client-server model — the upload speed of the server is the ceiling.

**Can we do better?** → Yes, with **Peer-to-Peer networks**.

---

## Peer-to-Peer (P2P) Networks

In a P2P network, all nodes are **equal peers**.

- Each party has the **same capabilities**
- Any peer **can initiate conversation** with any other peer

### Key Highlight of P2P: **Robustness**

- Even if you **remove one node** from the network, there would **not be any impact** on the service.
- **No single point of failure!**

### Central Entity (Hybrid P2P)

- There **may also be a central entity** to provide some functionalities (e.g., coordination, discovery)
- The peer nodes are still **equal** and would still communicate with each other **directly**
- But some info can be provided by the central entity

> **Note:** The network and its services **will be affected** when the central entity goes down. Hence, this setup is **more vulnerable to failures** compared to a pure P2P network.

---

## Simplified Download Flow in BitTorrent

When a user wants to download a file:

1. It **sniffs around the network** to find peers having **pieces** of the file
2. The user then downloads **different pieces** from **different users concurrently**

### Benefits:

- **Faster download** — parallelism across multiple peers
- **Better utilization of download capacity** — the downloader's bandwidth is fully utilized by pulling from many sources simultaneously
- Splitting the file into **smaller chunks boosts concurrency** even further

---

## Key BitTorrent Terminologies

> These come in handy when we deep dive into the algorithms.

### 1. Pieces and Blocks

A file shared in the BitTorrent network is split into **pieces**, and each piece is further split into **blocks**.

| Term | Description |
|------|------------|
| **Piece** | A larger chunk of the file. A piece is **served by a peer**. |
| **Block** | A smaller subdivision of a piece. In one transfer, a **block is transferred**. |

> ⚠️ **A piece cannot be served if any of its blocks is missing.** All blocks of a piece must be present for it to be valid and shareable.

### 2. Peer Set

Each peer maintains a **list of peers** that it can send pieces to — this is called its **Peer Set**.

**Example:**
- `peerset(A) = {C, E}` — A can send pieces to C and E
- `peerset(E) = {A, B, C}` — E can send pieces to A, B, and C

### 3. Active Peer Set

A peer can only send data to a **subset** of its peer set at any given time — this subset is called the **Active Peer Set**.

**Example:**
- `active peer set(A) = {C}` — A is currently sending data only to C
- `active peer set(E) = {A, B}` — E is currently sending data to A and B

> The active peer set determines **who you're actually uploading to** at any moment. This is controlled by BitTorrent's choking/unchoking algorithms.

### 4. Seeders and Leechers

A peer can be either a **Seeder** or a **Leecher**:

| Role | Description |
|------|------------|
| **Seeder** | A peer that has the **complete file** and is uploading/sharing it with others |
| **Leecher** | A peer that is still **downloading** the file (does not have all pieces yet) |

> A leecher can still upload pieces it already has to other peers while continuing to download the remaining pieces.

---

## Applications of BitTorrent

1. **Downloading Linux Distributions** — faster than FTP and HTTP
   - Also used for large software, movies, games, etc.

2. **Sending patches to users** — e.g., security patches distributed efficiently across millions of machines

3. **Facebook uses BitTorrent to power their massive deployments**
   - Deploying artifacts across thousands of servers using P2P rather than a centralized distribution server

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **BitTorrent** | P2P protocol for efficient large file distribution |
| **Classic Model Problem** | Server bandwidth is the bottleneck; doesn't scale |
| **P2P Advantage** | No single point of failure, leverages all peers' bandwidth |
| **Pieces & Blocks** | File → Pieces → Blocks; blocks are transferred, pieces are served |
| **Peer Set** | List of peers a node can communicate with |
| **Active Peer Set** | Subset of peer set currently receiving data |
| **Seeders** | Have the complete file, only upload |
| **Leechers** | Still downloading, can upload what they have |
| **Applications** | Linux distros, patches, Facebook deployments |
