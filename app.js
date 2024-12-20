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
    const ctx = document.getElementById('taskChart').getContext('2d');

    function createChart(department = null) {
        const dataSets = {
            'Development Department': { total: 100, completed: 60, inProcess: 25, pending: 15, color: '#007bff' },
            'Service Department': { total: 100, completed: 50, inProcess: 30, pending: 20, color: '#28a745' },
            'Account Department': { total: 100, completed: 70, inProcess: 20, pending: 10, color: '#17a2b8' },
            'Sales Department': { total: 100, completed: 55, inProcess: 30, pending: 15, color: '#ffc107' },
            'Store Department': { total: 100, completed: 45, inProcess: 35, pending: 20, color: '#dc3545' }
        };

        if (chart) {
            chart.destroy();
        }

        if (department && department !== 'All Departments') {
            const data = dataSets[department];
            chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Completed', 'In-Process', 'Pending'],
                    datasets: [{
                        data: [data.completed, data.inProcess, data.pending],
                        backgroundColor: [data.color, lightenColor(data.color, 40), lightenColor(data.color, 70)],
                        borderColor: [data.color, lightenColor(data.color, 40), lightenColor(data.color, 70)],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: department + ' - Task Status',
                            font: {
                                size: 20,
                                weight: 'bold'
                            }
                        }
                    }
                }
            });
        } else {
            const labels = Object.keys(dataSets);
            const completedData = labels.map(dept => dataSets[dept].completed);
            const inProcessData = labels.map(dept => dataSets[dept].inProcess);
            const pendingData = labels.map(dept => dataSets[dept].pending);
            const backgroundColors = labels.map(dept => dataSets[dept].color);

            chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: labels.map(dept => dataSets[dept].total),
                        backgroundColor: backgroundColors,
                        borderColor: backgroundColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right'
                        },
                        title: {
                            display: true,
                            text: 'All Departments - Task Status',
                            font: {
                                size: 24,
                                weight: 'bold'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const dataset = context.dataset;
                                    const total = dataset.data.reduce((acc, data) => acc + data, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    const deptData = dataSets[label];
                                    return [
                                        `${label}: ${percentage}% (${value} tasks)`,
                                        `Completed: ${deptData.completed}`,
                                        `In-Process: ${deptData.inProcess}`,
                                        `Pending: ${deptData.pending}`
                                    ];
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // Helper function to lighten a color
    function lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            B = (num >> 8 & 0x00FF) + amt,
            G = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000+ (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 +
            (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
    }

    // Department button click effect and chart update
    const departmentButtons = document.querySelectorAll('.department-buttons .btn');
    departmentButtons.forEach(button => {
        button.addEventListener('click', function() {
            departmentButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            createChart(this.textContent.trim());
        });
    });

    // Add click event for "All Departments" button
    const allDepartmentsButton = document.getElementById('allDepartmentsBtn');
    allDepartmentsButton.addEventListener('click', function() {
        departmentButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        createChart('All Departments');
    });

    // Initial chart creation
    createChart('All Departments');

    function createBarChart() {
        const ctx = document.getElementById('barChart').getContext('2d');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const departments = ['Development', 'Service', 'Account', 'Sales', 'Store'];

        const data = {
            labels: months,
            datasets: departments.flatMap((dept, index) => [
                {
                    label: dept + ' Completed',
                    data: months.map(() => Math.floor(Math.random() * 50) + 10),
                    backgroundColor: `rgba(${index * 50}, ${255 - index * 50}, ${index * 25}, 0.8)`,
                    stack: 'Stack ' + index,
                },
                {
                    label: dept + ' In-Process',
                    data: months.map(() => Math.floor(Math.random() * 30) + 5),
                    backgroundColor: `rgba(${index * 50}, ${255 - index * 50}, ${index * 25}, 0.5)`,
                    stack: 'Stack ' + index,
                },
                {
                    label: dept + ' Pending',
                    data: months.map(() => Math.floor(Math.random() * 20) + 5),
                    backgroundColor: `rgba(${index * 50}, ${255 - index * 50}, ${index * 25}, 0.3)`,
                    stack: 'Stack ' + index,
                }
            ])
        };

        let barChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'All Departments - Task Status (Monthly)',
                        font: {
                            size: 18,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        position: 'right',
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });
    }

    createBarChart();

    // Adjust chart size on window resize
    window.addEventListener('resize', function() {
        if (chart) {
            chart.resize();
        }
        if (barChart) {
            barChart.resize();
        }
    });
});