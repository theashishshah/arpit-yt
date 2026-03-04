# Everything you need to know about CRDTs (for system design)

---

## Intuition: what problem do CRDTs solve?

Visualize many replicas of the same object (e.g. a document, a counter) sitting in different regions or on different devices:

- Each replica can be updated locally, even when offline or partitioned.
- Later, replicas sync (send each other their changes).
- We want them to converge to the same value automatically, without central coordination and without conflicts.

CRDTs (Conflict-free Replicated Data Types) are specially designed data structures that guarantee convergence under those conditions.

---

## Key properties (high level)

- Eventual convergence: If all replicas have seen the same set of updates (in any order), they all end up with the same state.
- No coordination on each write: You don\'t need a leader or a lock every time you modify the data.
- Tolerant of partitions / offline work: Nodes can keep accepting writes locally and merge later.

They achieve this by:

- Designing operations that are commutative, associative, and idempotent, and/or
- Defining a merge function that is mathematically guaranteed to converge.

---

## Two big families of CRDTs

### 1. Operation-based (op-based)

- Each replica applies a local operation (e.g. "add 3", "insert char X at pos i") and broadcasts that operation to others.
- Everyone applies the same operations (possibly in different orders), and because operations are designed to commute, they reach the same result.

Needs reliable delivery of operations (often via some messaging system).

### 2. State-based (CvRDT)

- Each replica maintains a state (e.g. a set, a counter) and occasionally gossips its whole state (or a compressed version) to others.
- When a replica receives another state, it uses a merge function (usually a least upper bound / max) to combine them.

Requires:

- A partial order on states.
- Merge is commutative, associative, idempotent.

Example mental model: "Everyone keeps a local set; when we meet, we take the union of our sets."

---

## Classic CRDT examples (with visuals)

### G-Counter (grow-only counter)

Imagine N buckets, one per replica:

- Each replica only increments its own bucket.
- The value of the counter = sum of all buckets.
- Merge = element-wise max of buckets.

This ensures we never lose increments when merging.

### PN-Counter (positive/negative)

- Two G-Counters: one for increments (P), one for decrements (N).
- Value = P_sum - N_sum.
- Merge each underlying G-Counter with max as before.

### G-Set / 2P-Set (sets)

- G-Set: grow-only set, supports only add. Merge = union.
- 2P-Set: two grow-only sets, A (adds) and R (removes).
  - Element is present if it\'s in A and not in R.
  - Once removed, can\'t be added again (good for tombstones).

More advanced CRDTs (e.g. OR-Set, RGA, etc.) handle re-adds and ordered sequences (for collaborative text editing).

---

## Where are CRDTs useful in system design?

Think about places where:

- Writes can\'t always hit a leader, or you want low-latency local writes on the edge.
- You want offline-first behavior and automatic merge when devices come back online.

Examples:

- Collaboration tools (docs, whiteboards, code editors) – multiple users editing the same document concurrently.
- Messaging / chat – local message queues that sync across devices.
- Edge/IoT – devices collect data offline and sync periodically.
- Counters, likes, analytics – you can tolerate a bit of eventual consistency but want high write throughput.

In these designs you often see:

- AP-style systems (available under partitions) that still need some structured merge behavior.
- CRDTs give you a mathematically safe way to do that.

---

## Trade-offs and limitations (what CRDTs do not give you)

- They don\'t magically solve all conflicts; you still have to pick a data model whose merges make sense (e.g. counters, sets, last-writer-wins registers, list CRDTs).
- They usually assume eventual delivery of updates (no permanent data loss).
- They can be heavier in memory/metadata (e.g. per-replica vectors, tombstones).
- They are great for AP scenarios, but for strict invariants (e.g. bank balances) you may prefer strong consistency + coordination.

Visual rule of thumb:

- If you can answer "What should the result be if user A and user B both update this field concurrently?" with a pure function (like sum, max, union, last-writer-wins), then a CRDT is a good fit.

---

## Mental picture to remember CRDTs

Picture a group of people each carrying a notebook (their replica). They:

1. Write updates in their own notebook, even when separated.
2. When they meet, they copy missing entries from each other using a fixed rule (e.g. "take the max counter per person", "take the union of items").
3. As long as everyone eventually meets everyone (directly or via others), all notebooks converge to the same contents.

That is exactly what CRDTs formalize for distributed systems.

