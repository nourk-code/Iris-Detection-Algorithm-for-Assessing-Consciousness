const express = require('express');
const { PythonShell } = require('python-shell');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());

// Log every incoming request to the server
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

// Configure file uploads using multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// POST route to handle image uploads
app.post('/process-image', upload.single('image'), (req, res) => {
    console.log('Image received:', req.file);  // Log the uploaded file details

    const imagePath = req.file.path;
    let options = {
        args: [imagePath]
    };

    PythonShell.run('IrisDetector.py', options, (err, results) => {
        if (err) {
            console.error('Error running Python script:', err);
            return res.status(500).send(err);
        }
        console.log('Python script results:', results);
        res.send({ ratio: results });
    });
});

// Basic GET route for root URL
app.get('/', (req, res) => {
    res.send('Backend server is running.');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
