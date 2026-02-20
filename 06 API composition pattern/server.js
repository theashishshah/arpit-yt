import express from 'express';

const app = express();
const PORT = process.env.PORT || 9999;
const BASE = `http://localhost:${PORT}`;

app.use(express.json());

// --- Mock downstream "services" (in a real app these would be separate APIs) ---

app.get('/api/users', (_req, res) => {
    res.json({
        users: [
            { id: 1, name: 'Alice', email: 'alice@example.com' },
            { id: 2, name: 'Bob', email: 'bob@example.com' },
        ],
    });
});

app.get('/api/orders', (_req, res) => {
    res.json({
        orders: [
            { id: 101, userId: 1, total: 29.99 },
            { id: 102, userId: 2, total: 14.50 },
        ],
    });
});

app.get('/api/products', (_req, res) => {
    res.json({
        products: [
            { id: 1, name: 'Widget', price: 9.99 },
            { id: 2, name: 'Gadget', price: 19.99 },
        ],
    });
});

// --- Composer: one endpoint that calls multiple services and merges the response ---

app.get('/api/dashboard', async (_req, res) => {
    try {
        // Fan-out: call all services in parallel
        // how the 
        const [usersRes, ordersRes, productsRes] = await Promise.all([
            fetch(`${BASE}/api/users`),
            fetch(`${BASE}/api/orders`),
            fetch(`${BASE}/api/products`),
        ]);

        const [usersData, ordersData, productsData] = await Promise.all([
            usersRes.json(),
            ordersRes.json(),
            productsRes.json(),
        ]);

        // Compose a single response for the client
        res.json({
            users: usersData.users,
            orders: ordersData.orders,
            products: productsData.products,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('  Single services: GET /api/users, /api/orders, /api/products');
    console.log('  Composer (composition): GET /api/dashboard');
});
