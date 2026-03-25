# Overview of BitTorrent Architecture

BitTorrent architecture consists of four primary entities:

1.  **.torrent file**: A metafile that holds information about the file(s) to be shared.
2.  **Tracker**: A central entity that keeps track of which peers are in the swarm and which pieces they possess.
3.  **Seeders**: Peers that have the complete file and are uploading to others.
4.  **Leechers**: Peers that are still downloading the file (they often upload the pieces they already have to other leechers).

---

## Pieces

The original file being shared is split into equal-sized chunks called **pieces**.

-   **Size**: Typically ranges from **256KB to 1MB**.
-   **Hashing**: Every piece's **SHA-1 hash** is calculated and stored in the `.torrent` file under the `pieces` attribute.
-   **Verification**: When a peer downloads a piece, it verifies the integrity of the data by calculating its SHA-1 hash and comparing it with the hash stored in the `.torrent` file. This prevents data corruption.
-   **Identification**: Pieces are identified and fetched using their SHA-1 hashes from the `.torrent` file.

---

## The Swarm and Trading

A **swarm** is the entire collection of peers (seeders and leechers) sharing a particular torrent.

-   **Informing the Swarm**: Once a peer finishes downloading a piece, it informs other peers in the swarm that it now has that piece.
-   **Distributed Sharing**: This notification allows other peers to download that piece from multiple sources rather than just the original seeder.
-   **Trading**: Peers **trade pieces** with each other. This distributed nature is what makes BitTorrent highly scalable and fast.

---

## BitTorrent Workflow (Step-by-Step)

The typical flow for distributing a file via BitTorrent is as follows:

1.  **Upload Torrent**: The **First Seeder** (original uploader) creates and uploads the `.torrent` file to a **Torrent Server**.
2.  **Sync**: The Torrent Server syncs with **Search Engines** (like The Pirate Bay, etc.) to make the file discoverable.
3.  **Announce**: The First Seeder informs the **Tracker** that it is ready to seed the file (**First Seed**).
4.  **Search**: A **Peer** (downloader) searches for the file on a Search Engine.
5.  **Get Torrent File**: The Peer downloads the `.torrent` file, which contains the Tracker's address and the SHA-1 hashes of all pieces.
6.  **Get Peer List**: The Peer contacts the **Tracker** and receives a **peer list** (IP addresses of other seeders and leechers).
7.  **Get Pieces**: The Peer connects to the First Seeder (and other available peers) to start downloading pieces of the file.
8.  **Trade Pieces**: As the Peer acquires more pieces, it starts sharing them with other Peers in the swarm, contributing to the distributed download.
