(function(global){
    
    const ns = {};
    const homeHTML = "home.html";
    const allCategoriesURL = "categories/data/categories.json"; // Загальний список жанрів
    const categoryHtml = "categories/category-item.html";       // Картка жанру на головній
    
  
    const singleCatalogJsonUrl = "categories/data/films-catalog.json"; // ОДИН файл на всі фільми
    const catalogItemsTitleHtml = "categories/categories-title.html";  // Шаблон заголовка категорії
 

    const catalogItemHtml = "categories/data/catalogs/film-item.html"; 

    // Шаблон повної сторінки одного фільму (який ми щойно модифікували)
    const singleFilmHtml = "categories/data/catalogs/single-film.html";

    // Кеш для збереження ВСІХ фільмів (завантажується один раз)
    ns.cachedFilms = null;

    const insertHTML = function(selector, html){
        const targetElem = document.querySelector(selector);
        if(targetElem) targetElem.innerHTML = html;
    }

    const insertProperty = function (string, propName, propValue){
        const propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue || "");
        return string;
    }

    // При завантаженні сайту відображаємо домашню сторінку (залишаємо як було)
    document.addEventListener("DOMContentLoaded", function(event){
        ns.loadHomePage();
    });

    ns.loadHomePage = function(){
        $ajaxUtils.sendGetRequest(homeHTML, function(responseText){
            insertHTML("#main-content", responseText);
        }, false);
    };

    // 1. ЗАВАНТАЖЕННЯ УСІХ ЖАНРІВ (Картки на головній сторінці)
    ns.loadCatalogCategories = function(){
        $ajaxUtils.sendGetRequest(allCategoriesURL, buildAndShowCategoriesHTML);
    };

    function buildAndShowCategoriesHTML(categories){
        $ajaxUtils.sendGetRequest(categoryHtml, function(categoryHtmlTemplate){
            let finalHtml = " <div class='cards-box'><section class='row g-3'>";
            
            for(let i = 0; i < categories.length; i++){
                let html = categoryHtmlTemplate;
                html = insertProperty(html, "name", categories[i].name);
                html = insertProperty(html, "short_name", categories[i].short_name);
                finalHtml += html;
            }
            
            finalHtml += "</div></section>";
            insertHTML("#main-content", finalHtml);

            // Активуємо пошукову форму та теги, якщо вони підключені
            if (window.$nsFilter && typeof window.$nsFilter.initSearchAndTags === "function") {
                window.$nsFilter.initSearchAndTags();
            }
        }, false);
    }

    // 2. ДИНАМІЧНЕ ЗАВАНТАЖЕННЯ ФІЛЬМІВ ДЛЯ ОБРАНОЇ КАТЕГОРІЇ
    ns.loadCatalogItems = function(categoryShort){
        // Якщо фільми ще не завантажувалися з сервера, робимо запит
        if (!ns.cachedFilms) {
            $ajaxUtils.sendGetRequest(
                singleCatalogJsonUrl,
                function(allFilms) {
                    ns.cachedFilms = allFilms; // Зберігаємо у пам'ять
                    renderCategoryFilms(categoryShort);
                },
                true // Парсимо як JSON
            );
        } else {
            // Якщо список вже є в пам'яті — рендеримо миттєво
            renderCategoryFilms(categoryShort);
        }
    };

    function renderCategoryFilms(categoryShort) {
       
        $ajaxUtils.sendGetRequest(allCategoriesURL, function(categories) {
            const currentCategory = categories.find(cat => cat.short_name === categoryShort);
            const categoryName = currentCategory ? currentCategory.name : categoryShort.toUpperCase();


            let filteredFilms = [];
            if(categoryShort === "all"){
                filteredFilms = ns.cachedFilms;
            }
            else{
                filteredFilms = ns.cachedFilms.filter(film => {
                    return Array.isArray(film.category) && film.category.includes(categoryShort);
                });
            }
            
            // Завантажуємо спочатку заголовок категорії
            $ajaxUtils.sendGetRequest(catalogItemsTitleHtml, function(titleHtmlTemplate) {
                // Завантажуємо шаблон картки фільму
                $ajaxUtils.sendGetRequest(catalogItemHtml, function(catalogItemHtmlTemplate) {
                    
                    // 1. Будуємо заголовок категорії
                    let titleHtml = titleHtmlTemplate;
                    titleHtml = insertProperty(titleHtml, "name", categoryName);
                    titleHtml = insertProperty(titleHtml, "notes", "Перегляд фільмів за обраним жанром.");

                    // 2. Будуємо список відфільтрованих фільмів
                    let filmsHtml = "<div class='cards-box'><section class='row g-4'>";

                    filteredFilms.forEach(film => {
                        let html = catalogItemHtmlTemplate;
                        html = insertProperty(html, "id", film.id);
                        html = insertProperty(html, "name", film.name);
                        html = insertProperty(html, "description", film.description);
                      
                        filmsHtml += html;
                    });
                    filmsHtml += "</section></div>";

                    // Зклеюємо заголовок та фільми разом і виводимо в DOM
                    insertHTML("#main-content", titleHtml + filmsHtml);

                }, false);
            }, false);
        });
    }

    // 3. СТОРІНКА ОДНОГО КОНКРЕТНОГО ФІЛЬМУ
    ns.loadSingleFilm = function(filmId) {
        // Якщо користувач потрапив сюди напряму і кеш порожній — вантажимо JSON
        if (!ns.cachedFilms) {
            $ajaxUtils.sendGetRequest(singleCatalogJsonUrl, function(allFilms) {
                ns.cachedFilms = allFilms;
                const film = ns.cachedFilms.find(f => f.id === filmId);
                showSingleFilmDetails(film);
            }, true);
        } else {
            const film = ns.cachedFilms.find(f => f.id === filmId);
            showSingleFilmDetails(film);
        }
    };

  function showSingleFilmDetails(film) {
    if (!film) {
        insertHTML("#main-content", "<h2>Фільм не знайдено</h2>");
        return;
    }

    $ajaxUtils.sendGetRequest(singleFilmHtml, function(template){
        let html = template;

        // Словник для перекладу short_name у красиві назви
        const genreLabels = {
            "action": "Бойовик",
            "comedy": "Комедія",
            "drama": "Драма",
            "fantasy": "Фентезі",
            "sci-fi": "Наукова фантастика",
            "horror": "Жахи",
            "thriller": "Трилер",
            "romance": "Мелодрама",
            "animation": "Мультфільм"
        };

        // Перетворюємо масив ["sci-fi", "action"] на рядок з красивими бейджами Bootstrap
        let genresHtml = "";
        if (Array.isArray(film.category)) {
            genresHtml = film.category
                .map(cat => {
                    const label = genreLabels[cat] || cat; // якщо немає в словнику, залишаємо як є
                    return `<span class="badge bg-secondary me-1">${label}</span>`;
                })
                .join("");
        } else if (film.category) {
            const label = genreLabels[film.category] || film.category;
            genresHtml = `<span class="badge bg-secondary">${label}</span>`;
        }

        // Підставляємо дані в HTML-шаблон сторінки фільму
        html = insertProperty(html, "id", film.id);
        html = insertProperty(html, "name", film.name);
        html = insertProperty(html, "description", film.description);
        html = insertProperty(html, "year", film.year);
        html = insertProperty(html, "director", film.director);
        html = insertProperty(html, "country", film.country || "США"); // дефолт, якщо немає в json
        
        // Вставляємо вже згенеровані бейджи жанрів замість плейсхолдера
        html = insertProperty(html, "genres_display", genresHtml);
        
     
   
        insertHTML("#main-content", html);
    }, false);
}

  
       
    ns.loadRandomCategory = function () {
        $ajaxUtils.sendGetRequest(allCategoriesURL, function(categories) {
            const randomIndex = Math.floor(Math.random() * categories.length);
            const randomCategoryShortName = categories[randomIndex].short_name;
            ns.loadCatalogItems(randomCategoryShortName);
        });
    };

    global.$ns = ns;

})(window);
