import express from "express";

const app = express();

const requests = new Map();

const WINDOWS_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

const rateLimiter = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    const client = requests.get(ip);

    if (!client || now - client.startTime > WINDOWS_MS) {
        requests.set(ip, {
            count: 1,
            startTime: now
        });

        return next();
    }

    if (client.count >= MAX_REQUESTS) {
        return res.status(429).json({
            error: 'Too many requests. Try again later.'
        });
    }

    client.count++;

    next();
}

app.use(rateLimiter);

app.get('/api/users', (req, res) => {
    res.json({ message: 'Users retrieved successfully' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})