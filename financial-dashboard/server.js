const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');

const app = express();
const port = 3000;

// -- Middleware --
app.use(cors());
app.use(express.json());

// -- Database Configuration --
// IMPORTANT: Replace with your actual MySQL connection details
const dbConfig = {
    host: 'localhost',
    user: 'your_db_user',
    password: 'your_db_password',
    database: 'financial_data_db'
};

// -- File Upload Handling --
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

// == API ENDPOINTS ==

// 1. File Upload Endpoint
app.post('/api/finances/upload/:userId/:year', upload.single('file'), async (req, res) => {
    const { userId, year } = req.params;
    
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    if (!userId || !year) {
        return res.status(400).json({ message: 'User ID and year are required.' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // Process Excel file
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        if (data.length === 0) {
            return res.status(400).json({ message: 'The uploaded Excel file is empty.' });
        }
        
        // Validate headers
        const firstRow = data[0];
        if (!firstRow.hasOwnProperty('Month') || !firstRow.hasOwnProperty('Amount')) {
            return res.status(400).json({ message: 'Invalid Excel format. Please ensure columns are named "Month" and "Amount".' });
        }


        // Start a transaction
        await connection.beginTransaction();

        // For simplicity, we delete existing records for that user/year. 
        // See discussion points for other strategies.
        await connection.execute(
            'DELETE FROM financial_records WHERE user_id = ? AND year = ?',
            [userId, year]
        );

        // Insert new records
        const query = 'INSERT INTO financial_records (user_id, year, month, amount) VALUES (?, ?, ?, ?)';
        for (const row of data) {
            // Basic validation
            if (!row.Month || typeof row.Amount !== 'number') {
                throw new Error(`Invalid data format in Excel file. Row: ${JSON.stringify(row)}`);
            }
            await connection.execute(query, [userId, year, row.Month, row.Amount]);
        }
        
        await connection.commit();

        res.status(201).json({ message: `Successfully uploaded and stored ${data.length} records.` });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Upload Error:', error);
        res.status(500).json({ message: error.message || 'An error occurred during file processing.' });
    } finally {
        if (connection) await connection.end();
    }
});

// 2. Data Retrieval Endpoint
app.get('/api/finances/:userId/:year', async (req, res) => {
    const { userId, year } = req.params;

    if (!userId || !year) {
        return res.status(400).json({ message: 'User ID and year are required.' });
    }
    
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT month, amount FROM financial_records WHERE user_id = ? AND year = ?',
            [userId, year]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Data Retrieval Error:', error);
        res.status(500).json({ message: 'Failed to retrieve financial data.' });
    } finally {
        if (connection) await connection.end();
    }
});


// -- Start Server --
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
