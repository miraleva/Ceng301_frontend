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
// --- REPORTS & SP DEMO ROUTES ---
app.get('/reports', (req, res) => {
    const spResult = req.query.sp_result ? JSON.parse(req.query.sp_result) : null;

    // --- Mock SQL Computations ---

    // 1. Oldest Member (ORDER BY date_of_birth ASC LIMIT 1)
    const oldestMember = [...members].sort((a, b) => new Date(a.date_of_birth) - new Date(b.date_of_birth))[0];

    // 2. Most Popular Class (Count enrollments GROUP BY class_id)
    const classCounts = {};
    enrollments.forEach(e => { classCounts[e.class_id] = (classCounts[e.class_id] || 0) + 1; });
    const sortedClasses = Object.entries(classCounts).sort((a, b) => b[1] - a[1]);
    const popularClassId = sortedClasses.length > 0 ? parseInt(sortedClasses[0][0]) : null;
    const popularClass = popularClassId ? classes.find(c => c.class_id === popularClassId) : null;
    const popularClassCount = sortedClasses.length > 0 ? sortedClasses[0][1] : 0;

    // 3. Monthly Revenue (Simple sum for demo)
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // 4. Members by Membership Type (GROUP BY membership_id)
    const membershipCounts = {};
    members.forEach(m => {
        const mName = memberships.find(ms => ms.membership_id === m.membership_id)?.membership_name || 'Unknown';
        membershipCounts[mName] = (membershipCounts[mName] || 0) + 1;
    });

    // 5. Trainer Workload (Count classes GROUP BY trainer_id)
    const trainerWorkload = trainers.map(t => {
        const count = classes.filter(c => c.trainer_id === t.trainer_id).length;
        return { name: `${t.f_name} ${t.l_name}`, count };
    });

    // 6. Inactive Members (Left Join Enrollments where enrollment is null)
    // Simply: Members who have 0 enrollments
    const inactiveMembers = members.filter(m => !enrollments.some(e => e.member_id === m.member_id));

    // Prepare report data object
    const reportData = {
        oldestMember,
        popularClass: popularClass ? { ...popularClass, count: popularClassCount } : null,
        totalRevenue,
        membershipCounts,
        trainerWorkload,
        inactiveMembers
    };

    res.render('pages/reports', {
        title: 'Reports',
        path: '/reports',
        members,
        reportData,
        spResult
    });
});

// Mock Stored Procedure: calculate_member_lifetime_value(member_id)
app.post('/reports/sp-demo', (req, res) => {
    const { member_id } = req.body;
    const memberIdInt = parseInt(member_id);
    const member = members.find(m => m.member_id === memberIdInt);

    if (!member) {
        return res.redirect('/reports');
    }

    // Logic mimicking PL/pgSQL function
    const memberPayments = payments.filter(p => p.member_id === memberIdInt);
    const totalPaid = memberPayments.reduce((sum, p) => sum + p.amount, 0);
    const paymentCount = memberPayments.length;
    const lastPayment = memberPayments.length > 0
        ? memberPayments.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))[0].payment_date
        : 'N/A';

    const result = {
        member_name: `${member.f_name} ${member.l_name}`,
        total_paid: totalPaid,
        payment_count: paymentCount,
        last_payment_date: lastPayment
    };

    // Redirect with result (simulating "Output" param return)
    res.redirect(`/reports?sp_result=${encodeURIComponent(JSON.stringify(result))}`);
});

app.listen(port, () => {
    console.log(`Gym Management System running at http://localhost:${port}`);
});

app.listen(port, () => {
    console.log(`Gym Management System running at http://localhost:${port}`);
});
