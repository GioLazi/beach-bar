document.addEventListener("DOMContentLoaded", function() {
    const sheetId = 'Y1ldjJH4PmW-QwneQDIfogVvpmvN8aSEdBlAdhUbOVx_w'; // Замените на ваш ID таблицы
    const baseUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    const filterButtons = document.querySelectorAll('.filter-button');

    fetch(baseUrl)
        .then(response => response.text())
        .then(data => {
            const json = JSON.parse(data.substr(47).slice(0, -2));
            const rows = json.table.rows;
            const menuItems = rows.map(row => {
                return {
                    category: row.c[0].v,
                    name: row.c[1].v,
                    price: row.c[2].v,
                    highlight: row.c[3] ? row.c[3].v : false
                };
            });
            renderMenu(menuItems);

            // Добавьте обработчик кликов для кнопок фильтров
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Удалите класс 'active' со всех кнопок
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Добавьте класс 'active' к нажатой кнопке
                    button.classList.add('active');

                    const filter = button.getAttribute('data-filter');
                    filterMenu(filter, menuItems);
                });
            });
        })
        .catch(error => console.error('Error loading menu:', error));

    function renderMenu(data) {
        const menuContainer = document.getElementById('menu-container');
        menuContainer.innerHTML = ''; // Очистите контейнер перед добавлением новых элементов

        data.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');
            menuItem.setAttribute('data-category', item.category);

            const itemName = document.createElement('span');
            if (item.highlight) {
                const parts = item.name.split("ICECREAM");
                itemName.innerHTML = `${parts[0]}<span class="icecream">ICECREAM</span>${parts[1] || ''}`;
            } else {
                itemName.textContent = item.name;
            }

            const itemPrice = document.createElement('span');
            itemPrice.classList.add('price');
            itemPrice.textContent = item.price;

            menuItem.appendChild(itemName);
            menuItem.appendChild(itemPrice);
            menuContainer.appendChild(menuItem);
        });
    }

    function filterMenu(filter, data) {
        if (filter === 'all') {
            renderMenu(data);
        } else {
            const filteredItems = data.filter(item => item.category === filter);
            renderMenu(filteredItems);
        }
    }
});
