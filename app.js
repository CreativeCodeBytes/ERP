document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    let overlay = document.createElement('div');
    overlay.classList.add('sidebar-overlay');
    body.appendChild(overlay);

    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const sidebarCollapse = document.getElementById('sidebarCollapse');

    // Sidebar toggle for mobile
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            body.classList.toggle('sidebar-active');
        });
    }

    // Close sidebar when clicking on the overlay
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('sidebar-active');
    });

    // Close sidebar when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('sidebar-active');
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickInsideToggle = sidebarCollapse && sidebarCollapse.contains(event.target);
        if (!isClickInsideSidebar && !isClickInsideToggle && window.innerWidth < 768 && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('sidebar-active');
        }
    });

    // Sidebar dropdown and active state management
    const sidebarItems = document.querySelectorAll('#sidebar ul li a');
    const dropdownToggles = document.querySelectorAll('#sidebar .dropdown-toggle');

    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!this.classList.contains('dropdown-toggle')) {
                sidebarItems.forEach(i => i.parentElement.classList.remove('active'));
                this.parentElement.classList.add('active');
            }
        });
    });

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            const isSubmenu = parent.parentElement.id !== 'sidebarMenu';

            if (!isSubmenu) {
                dropdownToggles.forEach(t => {
                    if (t !== this && !t.closest('.collapse')) {
                        const targetId = t.getAttribute('href');
                        const targetCollapse = document.querySelector(targetId);
                        if (targetCollapse && targetCollapse.classList.contains('show')) {
                            new bootstrap.Collapse(targetCollapse).hide();
                        }
                    }
                });
            }
        });
    });

    // Initialize Chart
    let chart;
    const ctx = document.getElementById('turnoverChart').getContext('2d');
    
    function createChart(department = null) {
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Sample data (you should replace this with real data)
        const dataSets = {
            'Development Department': [15, 12, 17, 14, 16, 13, 18, 15, 14, 16, 17, 15],
            'Service Department': [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
            'Account Department': [5, 7, 6, 8, 7, 9, 8, 10, 9, 11, 10, 12],
            'Sales Department': [20, 22, 21, 23, 22, 24, 23, 25, 24, 26, 25, 27],
            'Store Department': [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
        };

        const data = {
            labels: labels,
            datasets: [{
                label: department || 'All Departments',
                data: department ? dataSets[department] : Object.values(dataSets).reduce((acc, curr) => curr.map((num, idx) => (acc[idx] || 0) + num), []),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + 'M';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: department || 'Factory Turnover Chart',
                        font: {
                            size: 20,
                            weight: 'bold'
                        }
                    }
                }
            }
        });
    }

    // Initial chart creation
    createChart();

    // Department button click effect and chart update
    const departmentButtons = document.querySelectorAll('.department-buttons .btn');
    departmentButtons.forEach(button => {
        button.addEventListener('click', function() {
            departmentButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            createChart(this.textContent.trim());
        });
    });

    // Adjust chart size on window resize
    window.addEventListener('resize', function() {
        if (chart) {
            chart.resize();
        }
    });
});

