const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Mock Data
const dashboardStats = {
    totalMembers: 142,
    activeClasses: 12,
    monthlyRevenue: 15400
};

// Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.get('/dashboard', (req, res) => {
    res.render('pages/dashboard', { 
        title: 'Dashboard',
        stats: dashboardStats
    });
});

// Placeholder routes for future steps
app.get('/members', (req, res) => res.send('Members Page - Coming Soon'));
app.get('/memberships', (req, res) => res.send('Memberships Page - Coming Soon'));
app.get('/trainers', (req, res) => res.send('Trainers Page - Coming Soon'));
app.get('/classes', (req, res) => res.send('Classes Page - Coming Soon'));
app.get('/enrollments', (req, res) => res.send('Enrollments Page - Coming Soon'));
app.get('/payments', (req, res) => res.send('Payments Page - Coming Soon'));
app.get('/reports', (req, res) => res.send('Reports Page - Coming Soon'));

app.listen(port, () => {
    console.log(`Gym Management System running at http://localhost:${port}`);
});
