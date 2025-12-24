const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// --- CONFIGURATION ---
// Set to true to switch to Backend API calls.
// Set to false to use local mock data.
const USE_API = false;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse body
app.use(express.urlencoded({ extended: true }));

// --- HELPERS ---
const getNextId = (arr, idField) => {
    return arr.length > 0 ? Math.max(...arr.map(item => item[idField])) + 1 : 1;
};

// Format Date Helper (DD-MM-YYYY)
const formatDate = (dateString, fallback = '') => {
    if (!dateString) return fallback;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// Make helper available to all views
app.use((req, res, next) => {
    res.locals.formatDate = formatDate;
    next();
});

// --- MOCK DATA ---
// These arrays act as our temporary database when USE_API is false.
let memberships = [
    { membership_id: 1, type: 'Silver', duration: 30, price: 300 },
    { membership_id: 2, type: 'Gold', duration: 90, price: 800 },
    { membership_id: 3, type: 'Platinum', duration: 365, price: 2500 }
];

let members = [
    { member_id: 1, first_name: 'John', last_name: 'Doe', gender: 'M', date_of_birth: '1990-05-15', registration_date: '2025-01-10', membership_id: 2, phone: '555-0101', email: 'john@example.com' },
    { member_id: 2, first_name: 'Jane', last_name: 'Smith', gender: 'F', date_of_birth: '1985-08-22', registration_date: '2025-02-01', membership_id: 1, phone: '555-0102', email: 'jane@example.com' },
    { member_id: 3, first_name: 'Ali', last_name: 'Veli', gender: 'M', date_of_birth: '2000-01-10', registration_date: '2025-03-05', membership_id: 3, phone: '555-0103', email: 'ali@example.com' }
];

let trainers = [
    { trainer_id: 1, first_name: 'Mike', last_name: 'Tyson', specialization: 'Boxing', phone: '555-9999', email: 'mike@gym.com' },
    { trainer_id: 2, first_name: 'Sarah', last_name: 'Connor', specialization: 'Cardio', phone: '555-8888', email: 'sarah@gym.com' }
];

let classes = [
    { class_id: 1, class_name: 'Morning Boxing', schedule: '2025-12-01', capacity: 20, trainer_id: 1 },
    { class_id: 2, class_name: 'Evening Yoga', schedule: '2025-12-01', capacity: 15, trainer_id: 2 }
];

let enrollments = [
    { enrollment_id: 1, member_id: 1, class_id: 1, enrollment_date: '2025-12-01' },
    { enrollment_id: 2, member_id: 2, class_id: 1, enrollment_date: '2025-12-02' }
];

let payments = [
    { payment_id: 1, member_id: 1, amount: 800, payment_date: '2025-11-20', payment_method: 'Credit Card' },
    { payment_id: 2, member_id: 2, amount: 300, payment_date: '2025-11-21', payment_method: 'Cash' }
];

// --- ROUTES ---

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

// --- DASHBOARD ---
app.get('/dashboard', async (req, res) => {
    let statsData, activityData;

    if (USE_API) {
        // TODO: FETCH DASHBOARD DATA FROM API
        // const dashboardData = await axios.get(`${API_URL}/dashboard`);
        // statsData = dashboardData.stats;
        // activityData = dashboardData.recentActivity;
        statsData = { totalMembers: 0, activeClasses: 0, monthlyRevenue: 0 }; // Placeholder
        activityData = []; // Placeholder
    } else {
        // Mock Logic
        statsData = {
            totalMembers: members.length,
            activeClasses: classes.length,
            monthlyRevenue: payments.reduce((acc, p) => acc + p.amount, 0)
        };

        const recentPayments = [...payments]
            .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date) || b.payment_id - a.payment_id)
            .slice(0, 5)
            .map(p => {
                const member = members.find(m => m.member_id === p.member_id);
                return {
                    type: 'Payment',
                    date: formatDate(p.payment_date),
                    text: `${member ? member.first_name + ' ' + member.last_name : 'Unknown Member'} paid $${p.amount}`
                };
            });

        const recentEnrollments = [...enrollments]
            .sort((a, b) => new Date(b.enrollment_date) - new Date(a.enrollment_date) || b.enrollment_id - a.enrollment_id)
            .slice(0, 5)
            .map(e => {
                const member = members.find(m => m.member_id === e.member_id);
                const cls = classes.find(c => c.class_id === e.class_id);
                return {
                    type: 'Enrollment',
                    date: formatDate(e.enrollment_date),
                    text: `${member ? member.first_name + ' ' + member.last_name : 'Unknown Member'} enrolled in ${cls ? cls.class_name : 'Class'}`
                };
            });

        activityData = [...recentPayments, ...recentEnrollments].slice(0, 5);
    }

    res.render('pages/dashboard', {
        title: 'Dashboard',
        path: '/dashboard',
        stats: statsData,
        recentActivity: activityData
    });
});

// --- MEMBERS ROUTES ---
app.get('/members', async (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    let localMembers, localMemberships;

    if (USE_API) {
        // TODO: CALL API
        // localMembers = await axios.get('/api/members');
        // localMemberships = await axios.get('/api/memberships');
        localMembers = [];
        localMemberships = [];
    } else {
        localMembers = members;
        localMemberships = memberships;
    }

    res.render('pages/members', {
        title: 'Members',
        path: '/members',
        members: localMembers,
        memberships: localMemberships,
        error,
        success
    });
});

app.post('/members/create', async (req, res) => {
    if (USE_API) {
        // TODO: POST TO API
        // await axios.post('/api/members', req.body);
    } else {
        const { first_name, last_name, gender, date_of_birth, registration_date, membership_id, phone, email } = req.body;
        const newItem = {
            member_id: getNextId(members, 'member_id'),
            first_name, last_name, gender, date_of_birth,
            registration_date: registration_date || new Date().toISOString().split('T')[0],
            membership_id: parseInt(membership_id),
            phone, email
        };
        members.push(newItem);
    }
    res.redirect('/members?success=Created Member Successfully');
});

app.post('/members/update', async (req, res) => {
    if (USE_API) {
        // TODO: PUT TO API
        // await axios.put(`/api/members/${req.body.member_id}`, req.body);
    } else {
        const { member_id, first_name, last_name, gender, date_of_birth, registration_date, membership_id, phone, email } = req.body;
        const index = members.findIndex(m => m.member_id == member_id);
        if (index !== -1) {
            members[index] = {
                ...members[index],
                first_name, last_name, gender, date_of_birth,
                registration_date,
                membership_id: parseInt(membership_id),
                phone, email
            };
        }
    }
    res.redirect('/members?success=Updated Member Successfully');
});

app.post('/members/delete', async (req, res) => {
    const { member_id } = req.body;
    if (USE_API) {
        // TODO: DELETE FROM API
        // await axios.delete(`/api/members/${member_id}`);
    } else {
        // Check constraints
        const hasEnrollments = enrollments.some(e => e.member_id == member_id);
        const hasPayments = payments.some(p => p.member_id == member_id);

        if (hasEnrollments || hasPayments) {
            return res.redirect('/members?error=Cannot delete member with associated enrollments or payments.');
        }
        members = members.filter(m => m.member_id != member_id);
    }
    res.redirect('/members?success=Deleted Member Successfully');
});

// --- MEMBERSHIPS ROUTES ---
app.get('/memberships', async (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    let localMemberships;

    if (USE_API) {
        // TODO: CALL API
        localMemberships = [];
    } else {
        localMemberships = memberships;
    }

    res.render('pages/memberships', {
        title: 'Memberships',
        path: '/memberships',
        memberships: localMemberships,
        error,
        success
    });
});

app.post('/memberships/create', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API
    } else {
        const { type, duration, price } = req.body;
        memberships.push({
            membership_id: getNextId(memberships, 'membership_id'),
            type,
            duration: parseInt(duration),
            price: parseFloat(price)
        });
    }
    res.redirect('/memberships?success=Created Membership Successfully');
});

app.post('/memberships/update', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API
    } else {
        const { membership_id, type, duration, price } = req.body;
        const index = memberships.findIndex(m => m.membership_id == membership_id);
        if (index !== -1) {
            memberships[index] = { ...memberships[index], type, duration: parseInt(duration), price: parseFloat(price) };
        }
    }
    res.redirect('/memberships?success=Updated Membership Successfully');
});

app.post('/memberships/delete', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API
    } else {
        const { membership_id } = req.body;
        const isUsed = members.some(m => m.membership_id == membership_id);
        if (isUsed) {
            return res.redirect('/memberships?error=Cannot delete membership assigned to members.');
        }
        memberships = memberships.filter(m => m.membership_id != membership_id);
    }
    res.redirect('/memberships?success=Deleted Membership Successfully');
});

// --- TRAINERS ROUTES ---
app.get('/trainers', async (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    let localTrainers;

    if (USE_API) {
        // TODO: CALL API
        localTrainers = [];
    } else {
        localTrainers = trainers;
    }

    res.render('pages/trainers', {
        title: 'Trainers',
        path: '/trainers',
        trainers: localTrainers,
        error,
        success
    });
});

app.post('/trainers/create', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API
    } else {
        const { first_name, last_name, specialization, phone, email } = req.body;
        const newItem = {
            trainer_id: getNextId(trainers, 'trainer_id'),
            first_name, last_name, specialization, phone, email
        };
        trainers.push(newItem);
    }
    res.redirect('/trainers?success=Created Trainer Successfully');
});

app.post('/trainers/update', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API
    } else {
        const { trainer_id, first_name, last_name, specialization, phone, email } = req.body;
        const index = trainers.findIndex(t => t.trainer_id == trainer_id);
        if (index !== -1) {
            trainers[index] = { ...trainers[index], first_name, last_name, specialization, phone, email };
        }
    }
    res.redirect('/trainers?success=Updated Trainer Successfully');
});

app.post('/trainers/delete', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API
    } else {
        const { trainer_id } = req.body;
        const isUsed = classes.some(c => c.trainer_id == trainer_id);
        if (isUsed) {
            return res.redirect('/trainers?error=Cannot delete trainer assigned to classes.');
        }
        trainers = trainers.filter(t => t.trainer_id != trainer_id);
    }
    res.redirect('/trainers?success=Deleted Trainer Successfully');
});

// --- CLASSES ROUTES ---
app.get('/classes', async (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    let localClasses, localTrainers;

    if (USE_API) {
        // TODO: CALL API
        localClasses = [];
        localTrainers = [];
    } else {
        localClasses = classes;
        localTrainers = trainers;
    }

    res.render('pages/classes', {
        title: 'Classes',
        path: '/classes',
        classes: localClasses,
        trainers: localTrainers,
        error,
        success
    });
});

app.post('/classes/create', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API
    } else {
        const { class_name, schedule, capacity, trainer_id } = req.body;

        const trainerExists = trainers.some(t => t.trainer_id == trainer_id);
        if (!trainerExists) {
            return res.redirect('/classes?error=Invalid Trainer Selected');
        }

        const newItem = {
            class_id: getNextId(classes, 'class_id'),
            class_name,
            schedule,
            capacity: parseInt(capacity) || 0,
            trainer_id: parseInt(trainer_id)
        };
        classes.push(newItem);
    }
    res.redirect('/classes?success=Created Class Successfully');
});

app.post('/classes/update', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API
    } else {
        const { class_id, class_name, schedule, capacity, trainer_id } = req.body;
        const index = classes.findIndex(c => c.class_id == class_id);
        if (index !== -1) {
            classes[index] = {
                ...classes[index],
                class_name,
                schedule,
                capacity: parseInt(capacity) || 0,
                trainer_id: parseInt(trainer_id)
            };
        }
    }
    res.redirect('/classes?success=Updated Class Successfully');
});

app.post('/classes/delete', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API
    } else {
        const { class_id } = req.body;
        const isUsed = enrollments.some(e => e.class_id == class_id);
        if (isUsed) {
            return res.redirect('/classes?error=Cannot delete class with active enrollments.');
        }
        classes = classes.filter(c => c.class_id != class_id);
    }
    res.redirect('/classes?success=Deleted Class Successfully');
});

// --- ENROLLMENTS ROUTES ---
app.get('/enrollments', async (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    let localEnrollments, localMembers, localClasses;

    if (USE_API) {
        // TODO: CALL API
        localEnrollments = [];
        localMembers = [];
        localClasses = [];
    } else {
        localEnrollments = enrollments;
        localMembers = members;
        localClasses = classes;
    }

    res.render('pages/enrollments', {
        title: 'Enrollments',
        path: '/enrollments',
        enrollments: localEnrollments,
        members: localMembers,
        classes: localClasses,
        error,
        success
    });
});

app.post('/enrollments/create', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API
    } else {
        const { member_id, class_id, enrollment_date } = req.body;

        const memberExists = members.some(m => m.member_id == member_id);
        const classExists = classes.some(c => c.class_id == class_id);

        if (!memberExists || !classExists) {
            return res.redirect('/enrollments?error=Invalid Member or Class');
        }

        const exists = enrollments.some(e => e.member_id == member_id && e.class_id == class_id);
        if (exists) {
            return res.redirect('/enrollments?error=Member is already enrolled in this class');
        }

        const newItem = {
            enrollment_id: getNextId(enrollments, 'enrollment_id'),
            member_id: parseInt(member_id),
            class_id: parseInt(class_id),
            enrollment_date: enrollment_date || new Date().toISOString().split('T')[0]
        };
        enrollments.push(newItem);
    }
    res.redirect('/enrollments?success=Member Enrolled Successfully');
});

app.post('/enrollments/delete', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API
    } else {
        const { enrollment_id } = req.body;
        enrollments = enrollments.filter(e => e.enrollment_id != enrollment_id);
    }
    res.redirect('/enrollments?success=Enrollment Removed Successfully');
});

// --- PAYMENTS ROUTES ---
app.get('/payments', async (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    let localPayments, localMembers;

    if (USE_API) {
        // TODO: CALL API
        localPayments = [];
        localMembers = [];
    } else {
        localPayments = payments;
        localMembers = members;
    }

    res.render('pages/payments', {
        title: 'Payments',
        path: '/payments',
        payments: localPayments,
        members: localMembers,
        error,
        success
    });
});

app.post('/payments/create', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API
    } else {
        const { member_id, amount, payment_date, payment_method } = req.body;

        const memberExists = members.some(m => m.member_id == member_id);
        if (!memberExists) return res.redirect('/payments?error=Invalid Member');

        const newItem = {
            payment_id: getNextId(payments, 'payment_id'),
            member_id: parseInt(member_id),
            amount: parseFloat(amount),
            payment_date: payment_date || new Date().toISOString().split('T')[0],
            payment_method
        };
        payments.push(newItem);
    }
    res.redirect('/payments?success=Payment Recorded Successfully');
});

app.post('/payments/update', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API
    } else {
        const { payment_id, member_id, amount, payment_date, payment_method } = req.body;
        const index = payments.findIndex(p => p.payment_id == payment_id);
        if (index !== -1) {
            payments[index] = {
                ...payments[index],
                member_id: parseInt(member_id),
                amount: parseFloat(amount),
                payment_date,
                payment_method
            };
        }
    }
    res.redirect('/payments?success=Payment Updated Successfully');
});

app.post('/payments/delete', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API
    } else {
        const { payment_id } = req.body;
        payments = payments.filter(p => p.payment_id != payment_id);
    }
    res.redirect('/payments?success=Payment Deleted Successfully');
});

// --- REPORTS ROUTES ---
app.get('/reports', async (req, res) => {
    let spResult = null;
    if (req.query.sp_result) {
        try {
            spResult = JSON.parse(req.query.sp_result);
        } catch (e) {
            console.error("Invalid sp_result JSON:", e);
        }
    }
    const error = req.query.error || null;
    const success = req.query.success || null;

    let localMembers, reportData;

    if (USE_API) {
        // TODO: CALL API FOR REPORTS
        localMembers = [];
        reportData = {
            oldestMember: null, popularClass: null, totalRevenue: 0,
            membershipCounts: {}, trainerWorkload: [], inactiveMembers: []
        };
    } else {
        localMembers = members;
        // Computations
        const oldestMember = [...members].sort((a, b) => new Date(a.date_of_birth) - new Date(b.date_of_birth))[0];

        const classCounts = {};
        enrollments.forEach(e => { classCounts[e.class_id] = (classCounts[e.class_id] || 0) + 1; });
        const sortedClasses = Object.entries(classCounts).sort((a, b) => b[1] - a[1]);
        const popularClassId = sortedClasses.length > 0 ? parseInt(sortedClasses[0][0]) : null;
        const popularClass = popularClassId ? classes.find(c => c.class_id === popularClassId) : null;
        const popularClassCount = sortedClasses.length > 0 ? sortedClasses[0][1] : 0;

        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

        const membershipCounts = {};
        members.forEach(m => {
            const mName = memberships.find(ms => ms.membership_id === m.membership_id)?.type || 'Unknown';
            membershipCounts[mName] = (membershipCounts[mName] || 0) + 1;
        });

        const trainerWorkload = trainers.map(t => {
            const count = classes.filter(c => c.trainer_id === t.trainer_id).length;
            return { name: `${t.first_name} ${t.last_name}`, count };
        });

        const inactiveMembers = members.filter(m => !enrollments.some(e => e.member_id === m.member_id));

        reportData = {
            oldestMember,
            popularClass: popularClass ? { ...popularClass, count: popularClassCount } : null,
            totalRevenue,
            membershipCounts,
            trainerWorkload,
            inactiveMembers
        };
    }

    res.render('pages/reports', {
        title: 'Reports',
        path: '/reports',
        members: localMembers,
        reportData,
        spResult,
        error,
        success
    });
});

app.post('/reports/sp-demo', async (req, res) => {
    if (USE_API) {
        // TODO: CALL API STORED PROCEDURE
        // const result = await axios.post('/api/rpc/calculate_member_lifetime_value', ...);
    } else {
        const { member_id } = req.body;
        const memberIdInt = parseInt(member_id);
        const member = members.find(m => m.member_id === memberIdInt);

        if (!member) {
            return res.redirect('/reports');
        }

        const memberPayments = payments.filter(p => p.member_id === memberIdInt);
        const totalPaid = memberPayments.reduce((sum, p) => sum + p.amount, 0);
        const paymentCount = memberPayments.length;
        const lastPayment = memberPayments.length > 0
            ? memberPayments.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))[0].payment_date
            : 'N/A';

        const result = {
            member_name: `${member.first_name} ${member.last_name}`,
            total_paid: totalPaid,
            payment_count: paymentCount,
            last_payment_date: formatDate(lastPayment)
        };
        return res.redirect(`/reports?sp_result=${encodeURIComponent(JSON.stringify(result))}`);
    }
    // Fallback if use_api is true but nothing implemented
    res.redirect('/reports');
});

app.listen(port, () => {
    console.log(`Gym Management System running at http://localhost:${port}`);
});
