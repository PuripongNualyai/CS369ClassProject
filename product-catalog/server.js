const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(__dirname + '/uploads'));
const SECRET_KEY = 'your_secret_key';

// Dummy user for authentication
const users = [
    {
      email: 'test@example.com',
      password: bcrypt.hashSync('password', 8), // Pre-hashed password
    },
  ];
  
  // Login route
  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
  
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  
    const passwordIsValid = bcrypt.compareSync(password, user.password);
  
    if (!passwordIsValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
  
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  
    res.json({ success: true, token });
  });
  
const dbConfig = {
    server: 'database-3.crg8kusugrkv.us-east-1.rds.amazonaws.com',
    database: 'productsweb',
    user: 'admin',
    password: 'perawat123',
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

let pool;

sql.connect(dbConfig).then(p => {
    pool = p;
    if (pool.connected) {
        console.log('Connected to the database');
    }
}).catch(err => {
    console.error('Database connection failed', err);
});

// Make sure to check if the pool is initialized before handling requests
const ensureDbConnection = (req, res, next) => {
    if (!pool) {
        return res.status(500).send('Database connection not established');
    }
    next();
};

app.use(ensureDbConnection);

app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT * FROM Products');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching products:', err);
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

    const picturePath = req.file ? req.file.filename : null; // Save only the filename, not the full path

    console.log('Received picture:', picturePath);

    const { ProductName, Price, Description } = req.body;
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
        console.error('Error inserting product:', err);
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
        console.error('Error deleting product:', err);
        res.status(500).send(err.message);
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Products WHERE ProductID = @id');
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});