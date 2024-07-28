const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Set up the database connection
const db = mysql.createConnection({
    host: 'sql7.freemysqlhosting.net',
    user: 'sql7722497',
    password: 'aRbwyEnjhM', // Use your MySQL password
    database: 'sql7722497'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to handle form submission
app.post('/submit', upload.single('idPicture'), (req, res) => {
    const { fullName, phoneNumber, email, acceptRights } = req.body;
    const idPicturePath = req.file ? req.file.path : null;

    // Insert data into the database
    const sql = 'INSERT INTO submissions (full_name, phone_number, email, id_picture, accept_rights) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [fullName, phoneNumber, email, idPicturePath, acceptRights === 'on'], (err, result) => {
        if (err) {
            console.error('Failed to insert data:', err.stack);
            res.status(500).send('Failed to submit form.');
            return;
        }

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailersend.net', // Your custom SMTP server hostname
            port: 587, // Your custom SMTP server port (e.g., 587 for TLS, 465 for SSL)
            secure: false, // Set to true if using port 465 or SSL
            auth: {
                user: 'MS_WqYkkJ@trial-z3m5jgr0qjzgdpyo.mlsender.net',
                pass: 'RM2seI0xDiwmwWna'
            }
        });

        const mailOptions = {
            from: 'MS_WqYkkJ@trial-z3m5jgr0qjzgdpyo.mlsender.net',
            to: 'csalexizu47@gmail.com', // Send confirmation to the email provided by the user
            subject: 'Osobné údaje - Blacklist',
            html: `
            <html>
            <body style="background-color: #333; color: #fff; font-family: Arial, sans-serif; text-align: center;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffff; padding: 20px; border-radius: 8px;">
                    <p><img src="https://imgdb.net/storage/uploads/76730badc7ffaf58793fa4968f143d2df599e702a40e1f4b24ccd9146e7c9040.png" alt="House Image" style="width: 300px; height: auto;"></p>
                    <footer style="margin-top: 20px; font-size: 0.8em; color: #aaa;">
                    <h1 style="font-weight: bold;">Nový Formulár Vyplnený</h1>
                    <p><strong>Formulár bol správne vyplnený a všetky práva boli akceptované.</strong></p>
                    <p><strong>Detaily:</strong></p>
                    <p><strong>Celé Meno:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Telefónne číslo:</strong> ${phoneNumber}</p>
                        &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
                    </footer>
                </div>
            </body>
            </html>
        `,
            
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Failed to send email:', error.stack);
                res.status(500).send('Failed to send confirmation email.');
                return;
            }
            console.log('Email sent:', info.response);
            res.send('Form successfully submitted!');
        });

        // Remove the file after reading its data
        if (idPicturePath) {
            fs.unlink(idPicturePath, (err) => {
                if (err) console.error('Failed to delete file:', err.stack);
            });
        }
    });
});

// Serve the HTML form
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
