# Database per microservice

**What it is:** A design rule in microservices where each service has its **own database** (or schema). No service shares a database with another; data is owned by one service and accessed only through that service’s API.

**Why use it:** Keeps services **loosely coupled** and **independently deployable**. Changes to one service’s schema don’t break others. Teams can choose the right database type per service (e.g. SQL for orders, document DB for catalog).

**Trade-off:** You give up easy joins and single DB transactions across services. Cross-service data needs to be combined via APIs (e.g. API composition) or events, not shared tables.

**Summary:** One service → one database. Data stays behind the service boundary.
