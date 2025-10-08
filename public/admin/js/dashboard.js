// Dashboard функціонал

let userGrowthChart = null;
let popularStoresChart = null;

// Завантаження статистики
async function loadDashboardStats() {
    const loader = document.getElementById('loader');
    const errorDiv = document.getElementById('error-message');

    loader.classList.remove('hidden');
    errorDiv.classList.add('hidden');

    try {
        const response = await authFetch('/api/admin/analytics');

        if (!response || !response.ok) {
            throw new Error('Помилка завантаження статистики');
        }

        const stats = await response.json();

        // Оновити stat cards
        document.getElementById('totalUsers').textContent = stats.data?.summary?.totalUsers || 0;
        document.getElementById('totalCards').textContent = stats.data?.summary?.totalCards || 0;
        document.getElementById('newUsersWeek').textContent = stats.data?.summary?.newUsersWeek || 0;
        document.getElementById('activeUsers').textContent = stats.data?.summary?.activeUsers || 0;

        // Показати зміну за тиждень
        const changeEl = document.getElementById('newUsersChange');
        if (stats.data?.summary?.newUsersWeek > 0) {
            changeEl.textContent = `+${stats.data.summary.newUsersWeek} за тиждень`;
            changeEl.className = 'stat-card-change positive';
        }

        // Відобразити графіки
        renderUserGrowthChart(stats.data?.growth?.users || []);
        renderPopularStoresChart(stats.data?.popular?.stores || []);

    } catch (error) {
        console.error('Load stats error:', error);
        errorDiv.textContent = 'Помилка завантаження статистики';
        errorDiv.classList.remove('hidden');
    } finally {
        loader.classList.add('hidden');
    }
}

// Графік росту користувачів
function renderUserGrowthChart(data) {
    const ctx = document.getElementById('userGrowthChart');
    if (!ctx) return;

    // Знищити попередній графік якщо існує
    if (userGrowthChart) {
        userGrowthChart.destroy();
    }

    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#B0B0B0' : '#4A4A4A';
    const gridColor = theme === 'dark' ? '#333333' : '#E9ECEF';

    userGrowthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => {
                const date = new Date(d.date);
                return date.toLocaleDateString('uk-UA', { month: 'short', day: 'numeric' });
            }),
            datasets: [{
                label: 'Нові користувачі',
                data: data.map(d => d.count),
                borderColor: '#0066FF',
                backgroundColor: 'rgba(0, 102, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        precision: 0
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

// Графік популярних магазинів
function renderPopularStoresChart(data) {
    const ctx = document.getElementById('popularStoresChart');
    if (!ctx) return;

    if (popularStoresChart) {
        popularStoresChart.destroy();
    }

    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#B0B0B0' : '#4A4A4A';
    const gridColor = theme === 'dark' ? '#333333' : '#E9ECEF';

    const colors = [
        '#0066FF',
        '#FF6B6B',
        '#10B981',
        '#F59E0B',
        '#8B5CF6'
    ];

    popularStoresChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.name),
            datasets: [{
                label: 'Кількість карток',
                data: data.map(d => d.count),
                backgroundColor: colors,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        precision: 0
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Оновлення графіків при зміні теми
document.addEventListener('DOMContentLoaded', () => {
    // Перевірка авторизації
    checkAuth();

    // Завантажити дані
    loadDashboardStats();

    // Оновлювати кожні 30 секунд
    setInterval(loadDashboardStats, 30000);

    // Перемалювати графіки при зміні теми
    const observer = new MutationObserver(() => {
        if (userGrowthChart) {
            const theme = document.documentElement.getAttribute('data-theme');
            const textColor = theme === 'dark' ? '#B0B0B0' : '#4A4A4A';
            const gridColor = theme === 'dark' ? '#333333' : '#E9ECEF';

            userGrowthChart.options.scales.y.ticks.color = textColor;
            userGrowthChart.options.scales.y.grid.color = gridColor;
            userGrowthChart.options.scales.x.ticks.color = textColor;
            userGrowthChart.options.scales.x.grid.color = gridColor;
            userGrowthChart.update();

            popularStoresChart.options.scales.y.ticks.color = textColor;
            popularStoresChart.options.scales.y.grid.color = gridColor;
            popularStoresChart.options.scales.x.ticks.color = textColor;
            popularStoresChart.update();
        }
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});
