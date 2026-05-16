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

        const searchForm = document.querySelector("#search-filter-form");
        if (searchForm) {
            searchForm.addEventListener("submit", function(event) {
                event.preventDefault();
                searchButton.click();
            });
        }
    };

    nsFilter.performSearch = function(textQuery, selectedGenresArray) {
        console.log("Шукаємо текст:", textQuery, "Жанри:", selectedGenresArray);
        
        if (!window.$ns || !window.$ns.cachedFilms) {
            console.error("Фільми ще не завантажені або об'єкт $ns недоступний.");
            return;
        }

        const queryLower = textQuery.toLowerCase();
        
        const filteredFilms = window.$ns.cachedFilms.filter(film => {
            // 1. Фільтр по тексту (шукаємо в назві або описі)
            const textMatch = !textQuery || 
                (film.name && film.name.toLowerCase().includes(queryLower)) ||
                (film.description && film.description.toLowerCase().includes(queryLower));

            // 2. Фільтр по жанрах (фільм повинен мати всі вибрані жанри - логіка AND)
            let genresMatch = true;
            if (selectedGenresArray && selectedGenresArray.length > 0) {
                const filmGenres = Array.isArray(film.category) ? film.category : [film.category];
                genresMatch = selectedGenresArray.every(genre => filmGenres.includes(genre));
            }

            return textMatch && genresMatch;
        });

        // Викликаємо функцію з script.js для оновлення списку фільмів у DOM
        if (typeof window.$ns.updateFilmsList === "function") {
            window.$ns.updateFilmsList(filteredFilms);
        } else {
            console.error("Функція updateFilmsList не знайдена в $ns.");
        }
    };

    global.$nsFilter = nsFilter;

})(window);