To be consistent, some network request may fail.
- bangalore server write but due to failure in network connection between these two mumbain and bangalore server, blr server couldn't write into mumbai server, so intead of showing the wrong data to user in mumbai, it simply fails to give response to user. [C+P]

but in case of instagram: [A+P]
- lets say you like a post in blr server but both mumbai and blr server are disconnected, so a user accesing in mumbai will not get the updated like but he/she will  surely will be able to use the service[instagram], not like user is making an request but mumbai server is not responding to user.

---

## Where does CAP actually apply?

Visualize a **rope** between Bangalore and Mumbai data centers. As long as the rope is intact, the two sides can stay perfectly in sync.  
The moment the rope is cut (network partition), you **cannot have both**:

- Every request gets a response (**Availability**), and  
- Every response sees the latest global state (**Consistency**, in the CAP sense = linearizability).

CAP is about this **“rope got cut” moment** in a **replicated, shared state system**:

- You have **the same logical data** (e.g. user accounts, balances, posts) copied to multiple places.  
- Clients can talk to **either side** of the partition.  
- The network can drop or delay messages between those copies.

It does **not** say much about:

- Single-node databases (no replication → no partition to reason about).  
- Pure caches in front of a single source of truth (although they still see stale data issues).  
- Background analytics pipelines where a bit of delay is acceptable by design.

CAP is most useful when you design things like:

- Geo-replicated databases (e.g. Google Spanner, Dynamo-style systems).  
- Multi-region application clusters where users can hit **any** region.  
- Systems where you must decide: “If the WAN link dies, what do we show to users?”

---

## “Google spammer” style story – seeing CAP in action

Picture **Gmail** fighting a spam wave:

- A user in **Bangalore** reports a sender as spam. That write goes to the **BLR** cluster.  
- At the same time, due to a WAN glitch, the link to **US/EU** clusters is flaky.

Now imagine millions of emails from that spammer are hitting inboxes across the world.

You have two visual options:

1. **Choose Consistency (C+P)**  
   - All regions must **agree** on the spammer list before delivering mail.  
   - While the rope (network) is cut, US/EU might **refuse to deliver** any mail from that sender (or even all mail that depends on that list), to avoid showing inconsistent state.  
   - Users see **errors / temporary unavailability**, but nobody sees “wrong” classification once the system replies.

2. **Choose Availability (A+P)**  
   - Each region **keeps serving** based on its local view.  
   - BLR cluster quickly blocks the spammer; US/EU keep delivering until they hear about the update.  
   - Every user request gets some response, but **different regions disagree** for a while on whether that mail is spam.

The core CAP question is:  
**“When the rope between regions is cut, should we show users *something possibly stale*, or show *nothing* until we’re sure?”**

Gmail, Search, Maps etc. usually pick **A+P** for user-facing behavior (you can always read/search), and rely on:

- Background reconciliation,  
- Versioning,  
- Idempotent operations,

to eventually clean up inconsistencies.

---

## When does CAP *not* bite you as hard?

Think about **read-only features** or **soft state**:

- Search suggestions being slightly stale → usually fine.  
- Like counts on Instagram being a bit behind → fine.  
- Dashboard metrics lagging by a minute → fine.

Here, you consciously accept **temporary inconsistency** because user experience is better if the app is always responsive.

But for **critical invariants**:

- Bank balance,  
- Inventory count for limited items,  
- Security-related flags (e.g. “is this token revoked?”),

you might decide that **showing wrong data is worse** than being temporarily down on some operations → lean towards **C+P** for those flows, often by centralizing them or using strong-consistency systems.

---

## Important CAP / consistency blogs and papers (for deeper reading)

Think of this as a “reading path” through the topic:

- **Eric Brewer – original CAP conjecture and clarification**  
  - *Brewer’s conjecture and the feasibility of consistent, available, partition-tolerant web services* (Gilbert & Lynch, formal proof).  
  - *CAP Twelve Years Later: How the “Rules” Have Changed* – Brewer’s own clarification that the popular “pick any 2” is too simplistic.

- **You can’t really drop P**  
  - *You Can’t Sacrifice Partition Tolerance* by Coda Hale – explains why in real networks partitions are inevitable; you can’t pretend “CA” exists if you have multiple nodes.

- **CAP misunderstandings and better mental models**  
  - *Please stop calling databases CP or AP* – Martin Kleppmann.  
  - *A Critique of the CAP Theorem* – deeper dive into why strict CAP terminology often misleads practitioners.

- **Google’s perspective and systems**  
  - *Inside Cloud Spanner and the CAP Theorem* – Google Cloud blog explaining how Spanner aims for strong consistency yet very high availability in practice.  
  - *Paxos Made Live: An Engineering Perspective* – Google’s paper on turning the Paxos consensus algorithm into a production system.

When you read these, imagine a **map**:

- Brewer and Gilbert/Lynch define the **theoretical triangle** (C, A, P).  
- Coda Hale and Kleppmann put warning signs around misusing that triangle.  
- Google’s Spanner papers show how far you can push **strong consistency** while still having excellent **practical availability**.

---

## Visual mental model to remember CAP

Keep three pictures in mind:

1. **Single rope between two cities (Bangalore ↔ Mumbai)**  
   - Rope intact: you can have both C and A.  
   - Rope cut: you must choose to **either**:
     - Let both cities operate locally and drift (A+P), or  
     - Stop one side until rope is fixed (C+P).

2. **Instagram like button**  
   - You tap “like” in Bangalore.  
   - Mumbai user may not see it yet, but **their feed keeps working** → clear A+P intuition.

3. **Bank transfer**  
   - Two ATMs in different cities.  
   - If the rope is cut, safest is to **reject withdrawal** that might overdraft → C+P behavior.

Whenever you design a distributed feature, ask yourself:

> “If the rope between my replicas is cut, which of these three pictures do I want my system to look like?”
