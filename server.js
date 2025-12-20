const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse body
app.use(express.urlencoded({ extended: true }));

// Mock Data
let memberships = [
    { membership_id: 1, membership_name: 'Silver', duration: 30, price: 300 },
    { membership_id: 2, membership_name: 'Gold', duration: 90, price: 800 },
    { membership_id: 3, membership_name: 'Platinum', duration: 365, price: 2500 }
];

let members = [
    { member_id: 1, f_name: 'John', l_name: 'Doe', date_of_birth: '1990-05-15', membership_id: 2, phone: '555-0101', email: 'john@example.com' },
    { member_id: 2, f_name: 'Jane', l_name: 'Smith', date_of_birth: '1985-08-22', membership_id: 1, phone: '555-0102', email: 'jane@example.com' },
    { member_id: 3, f_name: 'Ali', l_name: 'Veli', date_of_birth: '2000-01-10', membership_id: 3, phone: '555-0103', email: 'ali@example.com' }
];

const dashboardStats = {
    totalMembers: members.length,
    activeClasses: 12,
    monthlyRevenue: 15400
};

// Helpers
const getNextId = (arr, idField) => {
    return arr.length > 0 ? Math.max(...arr.map(item => item[idField])) + 1 : 1;
};

// Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.get('/dashboard', (req, res) => {
    // Recalculate stats for demo dynamic feel
    const currentStats = {
        ...dashboardStats,
        totalMembers: members.length
    };
    res.render('pages/dashboard', {
        title: 'Dashboard',
        path: '/dashboard',
        stats: currentStats
    });
});

// --- MEMBERS ROUTES ---
app.get('/members', (req, res) => {
    const error = req.query.error;
    const success = req.query.success;
    res.render('pages/members', {
        title: 'Members',
        path: '/members',
        members,
        memberships,
        error,
        success
    });
});

app.post('/members/create', (req, res) => {
    const { f_name, l_name, date_of_birth, membership_id, phone, email } = req.body;
    const newItem = {
        member_id: getNextId(members, 'member_id'),
        f_name, l_name, date_of_birth,
        membership_id: parseInt(membership_id),
        phone, email
    };
    members.push(newItem);
    res.redirect('/members?success=Created Member Successfully');
});

app.post('/members/update', (req, res) => {
    const { member_id, f_name, l_name, date_of_birth, membership_id, phone, email } = req.body;
    const index = members.findIndex(m => m.member_id == member_id);
    if (index !== -1) {
        members[index] = {
            ...members[index],
            f_name, l_name, date_of_birth,
            membership_id: parseInt(membership_id),
            phone, email
        };
    }
    res.redirect('/members?success=Updated Member Successfully');
});

app.post('/members/delete', (req, res) => {
    const { member_id } = req.body;
    members = members.filter(m => m.member_id != member_id);
    res.redirect('/members?success=Deleted Member Successfully');
});

// --- MEMBERSHIPS ROUTES ---
app.get('/memberships', (req, res) => {
    const error = req.query.error;
    const success = req.query.success;
    res.render('pages/memberships', {
        title: 'Memberships',
        path: '/memberships',
        memberships,
        error,
        success
    });
});

app.post('/memberships/create', (req, res) => {
    const { membership_name, duration, price } = req.body;
    memberships.push({
        membership_id: getNextId(memberships, 'membership_id'),
        membership_name,
        duration: parseInt(duration),
        price: parseFloat(price)
    });
    res.redirect('/memberships?success=Created Membership Successfully');
});

app.post('/memberships/update', (req, res) => {
    const { membership_id, membership_name, duration, price } = req.body;
    const index = memberships.findIndex(m => m.membership_id == membership_id);
    if (index !== -1) {
        memberships[index] = { ...memberships[index], membership_name, duration: parseInt(duration), price: parseFloat(price) };
    }
    res.redirect('/memberships?success=Updated Membership Successfully');
});

app.post('/memberships/delete', (req, res) => {
    const { membership_id } = req.body;
    // Check constraint: Membership 1:N Member
    const isUsed = members.some(m => m.membership_id == membership_id);
    if (isUsed) {
        return res.redirect('/memberships?error=Cannot delete membership assigned to members.');
    }
    memberships = memberships.filter(m => m.membership_id != membership_id);
    res.redirect('/memberships?success=Deleted Membership Successfully');
});

// Placeholder routes for future steps
app.get('/trainers', (req, res) => res.render('pages/trainers', { title: 'Trainers', path: '/trainers' })); // Will fail if view not exists, but we'll add it later or revert to send string
// For now, keep simple string responses for unfinished routes to avoid crash if user clicks
app.get('/trainers', (req, res) => res.send('Trainers Page - Coming Soon'));
app.get('/classes', (req, res) => res.send('Classes Page - Coming Soon'));
app.get('/enrollments', (req, res) => res.send('Enrollments Page - Coming Soon'));
app.get('/payments', (req, res) => res.send('Payments Page - Coming Soon'));
app.get('/reports', (req, res) => res.send('Reports Page - Coming Soon'));

app.listen(port, () => {
    console.log(`Gym Management System running at http://localhost:${port}`);
});
