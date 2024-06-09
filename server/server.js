const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { evaluate } = require('mathjs');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/calculate', (req, res) => {
    const { expression } = req.body;
    try {
        const result = evaluate(expression);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: 'Invalid expression' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
