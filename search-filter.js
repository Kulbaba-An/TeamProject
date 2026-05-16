// search-filter.js
(function(global) {
    const nsFilter = {};
    let selectedGenres = [];

    // Цю функцію ми викликатимемо ТОДІ, коли HTML-форма пошуку вже вставилася в DOM
    nsFilter.initSearchAndTags = function() {
        const tagsContainer = document.querySelector("#tags-container");
        const dropdownMenu = document.querySelector("#add-tag-dropdown");
        const dropdownItems = document.querySelectorAll("#dropdown-genres-list .dropdown-item");
        const searchButton = document.querySelector("#search-button");

        // Перевірка безпеки: якщо форми пошуку на поточній сторінці немає, нічого не робимо
        if (!tagsContainer || !dropdownMenu || !searchButton) return;

        // Очищуємо масив при кожній новій ініціалізації сторінки
        selectedGenres = [];

        function renderTags() {
            const oldTags = tagsContainer.querySelectorAll(".badge-tag");
            oldTags.forEach(tag => tag.remove());

            selectedGenres.forEach(genre => {
                const tagBtn = document.createElement("button");
                tagBtn.type = "button";
                tagBtn.className = "btn btn-primary btn-sm d-flex align-items-center gap-2 badge-tag";
                tagBtn.innerHTML = `${genre.name} <span style="font-weight:bold; cursor:pointer;">&times;</span>`;
                
                tagBtn.addEventListener("click", function() {
                    removeGenre(genre.value);
                });

                tagsContainer.insertBefore(tagBtn, dropdownMenu);
            });

            dropdownItems.forEach(item => {
                const val = item.getAttribute("data-value");
                const isAlreadySelected = selectedGenres.some(g => g.value === val);
                item.style.display = isAlreadySelected ? "none" : "block";
            });
        }

        function addGenre(value, name) {
            if (!selectedGenres.some(g => g.value === value)) {
                selectedGenres.push({ value: value, name: name });
                renderTags();
            }
        }

        function removeGenre(value) {
            selectedGenres = selectedGenres.filter(g => g.value !== value);
            renderTags();
        }

        dropdownItems.forEach(item => {
            // Клонуємо, щоб скинути старі слухачі, якщо функція init викликається повторно
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);

            newItem.addEventListener("click", function(event) {
                event.preventDefault();
                addGenre(this.getAttribute("data-value"), this.textContent);
            });
        });

        searchButton.addEventListener("click", function() {
            const query = document.querySelector("#search-input").value.trim();
            const genresToSearch = selectedGenres.map(g => g.value);
            
            // Виклик функції пошуку
            nsFilter.performSearch(query, genresToSearch);
        });
    };

    nsFilter.performSearch = function(textQuery, selectedGenresArray) {
        console.log("Шукаємо текст:", textQuery, "Жанри:", selectedGenresArray);
        // Тут ваша логіка фільтрації масиву даних
    };

    global.$nsFilter = nsFilter;

})(window);