const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('transactions.db');

const database = {
    transactions: [],
};

const thirdPartyApiUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

async function initializeDatabase() {
    try {
        const options = {
            method: 'GET',
        };
        
        const response = await fetch(thirdPartyApiUrl, options);

        db.run(`
            CREATE TABLE transactions (
                id INTEGER PRIMARY KEY,
                title TEXT,
                description TEXT,
                price INTEGER,
                category TEXT,
                sold BOOLEAN,
                image TEXT,
                dateOfSale DATE
            )
        `);

        // Insert data into the table
        data.forEach((item) => {
        db.run('INSERT INTO transactions (id, title, description, price, category, sold, image, dateOfSale) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [item.id, item.title, item.description, item.price, item.category, item.sold, item.image, item.dateOfSale]);
        });
        
        if (response.status === 200) {
            database.transactions = await response.json();
            console.log('Database initialized successfully.');
            return true;
        } else {
        console.error('Failed to initialize the database:', response.status);
        return false;
        }
    } catch (error) {
        console.error('Failed to fetch data from the third-party API:', error.message);
        return false;
    }
}

const monthMap = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
};

function filterTransactionsByMonth(month) {
    const monthNumber = monthMap[month];
    return database.transactions.filter(
        (transaction) => transaction.dateOfSale.split('-')[1] === monthNumber
    );
}

app.get('/api/init-database', async (req, res) => {
    if (await initializeDatabase()) {
        res.json({ message: 'Database initialized successfully.' });
    } else {
        res.status(500).json({ error: 'Failed to initialize the database.' });
    }
});

app.get('/api/statistics', (req, res) => {
    const month = req.query.month;
    const transactions = filterTransactionsByMonth(month);

    const totalSaleAmount = transactions.reduce(
        (total, transaction) => total + transaction.price,
        0
    );
    const totalSoldItems = transactions.filter((t) => t.isSold).length;
    const totalNotSoldItems = transactions.filter((t) => !t.isSold).length;

    res.json({
        totalSaleAmount,
        totalSoldItems,
        totalNotSoldItems,
    });
});

app.get('/api/bar-chart', (req, res) => {
    const month = req.query.month;
    const transactions = filterTransactionsByMonth(month);

    const priceRanges = {
        '0-100': 0,
        '101-200': 0,
        '201-300': 0,
        '301-400': 0,
        '401-500': 0,
        '501-600': 0,
        '601-700': 0,
        '701-800': 0,
        '801-900': 0,
        '901-above': 0,
    };

    transactions.forEach((transaction) => {
        const price = transaction.price;
        if (price >= 0 && price <= 100) priceRanges['0-100']++;
        else if (price <= 200) priceRanges['101-200']++;
        else if (price <= 300) priceRanges['201-300']++;
        else if (price <= 400) priceRanges['301-400']++;
        else if (price <= 500) priceRanges['401-500']++;
        else if (price <= 600) priceRanges['501-600']++;
        else if (price <= 700) priceRanges['601-700']++;
        else if (price <= 800) priceRanges['701-800']++;
        else if (price <= 900) priceRanges['801-900']++;
        else priceRanges['901-above']++;
    });

    res.json(priceRanges);
});

app.get('/api/pie-chart', (req, res) => {
    const month = req.query.month;
    const transactions = filterTransactionsByMonth(month);

    const categories = {};
    transactions.forEach((transaction) => {
        const category = transaction.category;
        categories[category] = (categories[category] || 0) + 1;
    });

    res.json(categories);
});

app.get('/api/combined-data', async (req, res) => {
    const month = req.query.month;

    try {
        const [statistics, barChart, pieChart] = await Promise.all([
        axios.get(`http://localhost:${port}/api/statistics?month=${month}`),
        axios.get(`http://localhost:${port}/api/bar-chart?month=${month}`),
        axios.get(`http://localhost:${port}/api/pie-chart?month=${month}`),
        ]);

        const combinedData = {
        statistics: statistics.data,
        barChart: barChart.data,
        pieChart: pieChart.data,
        };

        res.json(combinedData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch combined data.' });
    }
});

app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    const initialized = await initializeDatabase();
    if (!initialized) {
        console.error('Failed to initialize the database. Exiting...');
        process.exit(1);
    }
});