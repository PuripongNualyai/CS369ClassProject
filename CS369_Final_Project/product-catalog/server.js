const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

const dbConfig = {
    server: 'localhost',
    database: 'peerah',
    user: 'sa',
    password: 'Strong@P@ssw0rd',
    options: {
        encrypt: false,
        trustServerCertificate: true // Use true if you want to bypass server certificate validation.
    }
};

const uploadPath = path.join(__dirname, 'uploads');

// Check if the directory exists
fs.access(uploadPath, fs.constants.F_OK, (err) => {
    if (err) {
        console.log('Upload directory does not exist, creating it...');
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating upload directory:', err);
            } else {
                console.log('Upload directory created successfully');
            }
        });
    } else {
        console.log('Upload directory exists');
    }
});

sql.connect(dbConfig).then(pool => {
    if (pool.connected) {
        console.log('Connected to the database');
    }

    app.get('/api/products', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Products');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
            const fileName = `${timestamp}_${random}.jpg`; // Append ".jpg"
            cb(null, fileName);
        }
    });

    const upload = multer({ storage: storage });

    app.post('/insert', upload.single('picture'), async (req, res) => {
        console.log(req.file);

        const picturePath = req.file ? req.file.filename : null;
        
        console.log('Received picture:', picturePath);

        const { ProductName, ProductImage, Price, Description } = req.body;
        try {
            await pool.request()
                .input('ProductName', sql.NVarChar, ProductName)
                .input('ProductImage', sql.NVarChar, picturePath)
                .input('Price', sql.Decimal, Price)
                .input('Description', sql.NVarChar, Description)
                .query(`INSERT INTO Products (ProductName, Price, ProductImage, Description)
                        VALUES (@ProductName, @Price, @ProductImage, @Description)`);
            res.send('Form data received and inserted into the database successfully!');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    app.delete('/api/products/:id', async (req, res) => {
        try {
            await pool.request()
                .input('id', sql.Int, req.params.id)
                .query('DELETE FROM Products WHERE ProductID = @id');
            res.status(200).send('Product deleted');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

}).catch(err => {
    console.error('Database connection failed', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
