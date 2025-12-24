document.addEventListener('DOMContentLoaded', () => {

    // Modal handling
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const openModalButtons = document.querySelectorAll('[data-modal-target]');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        // Reset form if present inside
        const form = modal.querySelector('form');
        if (form) form.reset();
    }

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-target');
            openModal(modalId);
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Dynamic data population

    // Edit Buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const data = JSON.parse(btn.getAttribute('data-entry'));
            const modalId = btn.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);

            // Populate inputs matching object keys
            Object.keys(data).forEach(key => {
                const input = modal.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = data[key];
                }
            });

            // Switch form action to update
            const form = modal.querySelector('form');
            const resource = form.getAttribute('data-resource'); // e.g., 'members'
            if (resource) {
                form.action = `/${resource}/update`;
            }
        });
    });

    // Add Buttons
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            const form = modal.querySelector('form');
            const resource = form.getAttribute('data-resource');
            if (resource) {
                form.action = `/${resource}/create`;
            }
        });
    });

    // Delete Buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const modalId = btn.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);

            // Set input value for ID
            const input = modal.querySelector('input[name*="_id"]');
            if (input) input.value = id;
        });
    });


    // Table search
    const searchInput = document.getElementById('tableSearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', function () {
            const value = this.value.toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.indexOf(value) > -1 ? '' : 'none';
            });
        });
    }

    // Membership filter
    const filterDropdown = document.getElementById('membershipFilter');
    if (filterDropdown) {
        filterDropdown.addEventListener('change', function () {
            const value = this.value.toLowerCase(); // Name of membership or ID
            const rows = document.querySelectorAll('.data-table tbody tr');

            rows.forEach(row => {
                if (value === 'all') {
                    row.style.display = '';
                } else {
                    const membershipCell = row.querySelector('[data-type="membership"]');
                    const text = membershipCell ? membershipCell.textContent.toLowerCase() : '';
                    row.style.display = text.includes(value) ? '' : 'none';
                }
            });
        });
    }

});

// Utilities
function calculateAge(dobString) {
    if (!dobString) return '';
    const today = new Date();
    const dob = new Date(dobString);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}
