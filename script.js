(function(global){
    
    const ns = {};
    const homeHTML = "home.html";
    const allCategoriesURL = "categories/data/categories.json"; 
    const categoryHtml = "categories/category-item.html";      
    
  
    const singleCatalogJsonUrl = "categories/data/films-catalog.json"; 
    const catalogItemsTitleHtml = "categories/categories-title.html"; 
 

    const catalogItemHtml = "categories/data/catalogs/film-item.html"; 

  
    const singleFilmHtml = "categories/data/catalogs/single-film.html";

  
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

  
    document.addEventListener("DOMContentLoaded", function(event){
        ns.loadHomePage();
    });

    ns.loadHomePage = function(){
        $ajaxUtils.sendGetRequest(homeHTML, function(responseText){
            insertHTML("#main-content", responseText);
        }, false);
    };


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

       
            if (window.$nsFilter && typeof window.$nsFilter.initSearchAndTags === "function") {
                window.$nsFilter.initSearchAndTags();
            }
        }, false);
    }


    ns.loadCatalogItems = function(categoryShort){
     
        if (!ns.cachedFilms) {
            $ajaxUtils.sendGetRequest(
                singleCatalogJsonUrl,
                function(allFilms) {
                    ns.cachedFilms = allFilms; 
                    renderCategoryFilms(categoryShort);
                },
                true 
            );
        } else {
            renderCategoryFilms(categoryShort);
        }
    };

    ns.updateFilmsList = function(films) {
        $ajaxUtils.sendGetRequest(catalogItemHtml, function(catalogItemHtmlTemplate) {
            let filmsHtml = "<div class='cards-box' id='films-list-container'><section class='row g-4'>";

            films.forEach(film => {
                let html = catalogItemHtmlTemplate;
                html = insertProperty(html, "id", film.id);
                html = insertProperty(html, "name", film.name);
                html = insertProperty(html, "description", film.description);
                let imgUrl = film.imageUrl || ("categories/data/catalogs/images/" + film.id + ".jpg");
                html = insertProperty(html, "imageUrl", imgUrl);
                filmsHtml += html;
            });
            filmsHtml += "</section></div>";

            const existingContainer = document.querySelector("#films-list-container");
            if (existingContainer) {
                existingContainer.outerHTML = filmsHtml;
            } else {
                const mainContent = document.querySelector("#main-content");
                const oldCardsBox = mainContent.querySelector(".cards-box");
                if (oldCardsBox) {
                    oldCardsBox.outerHTML = filmsHtml;
                } else {
                    mainContent.innerHTML += filmsHtml;
                }
            }
        }, false);
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
            
        
            $ajaxUtils.sendGetRequest(catalogItemsTitleHtml, function(titleHtmlTemplate) {
                $ajaxUtils.sendGetRequest(catalogItemHtml, function(catalogItemHtmlTemplate) {
                    

                    let titleHtml = titleHtmlTemplate;
                    titleHtml = insertProperty(titleHtml, "name", categoryName);
                    titleHtml = insertProperty(titleHtml, "notes", "Перегляд фільмів за обраним жанром.");


                    let filmsHtml = "<div class='cards-box' id='films-list-container'><section class='row g-4'>";

                    filteredFilms.forEach(film => {
                        let html = catalogItemHtmlTemplate;
                        html = insertProperty(html, "id", film.id);
                        html = insertProperty(html, "name", film.name);
                        html = insertProperty(html, "description", film.description);
                        let imgUrl = film.imageUrl || ("categories/data/catalogs/images/" + film.id + ".jpg");
                        html = insertProperty(html, "imageUrl", imgUrl);
                      
                        filmsHtml += html;
                    });
                    filmsHtml += "</section></div>";

                    insertHTML("#main-content", titleHtml + filmsHtml);

                    if (window.$nsFilter && typeof window.$nsFilter.initSearchAndTags === "function") {
                        window.$nsFilter.initSearchAndTags();
                    }

                }, false);
            }, false);
        });
    }


    ns.loadSingleFilm = function(filmId) {

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

        let genresHtml = "";
        if (Array.isArray(film.category)) {
            genresHtml = film.category
                .map(cat => {
                    const label = genreLabels[cat] || cat; 
                    return `<span class="badge bg-secondary me-1">${label}</span>`;
                })
                .join("");
        } else if (film.category) {
            const label = genreLabels[film.category] || film.category;
            genresHtml = `<span class="badge bg-secondary">${label}</span>`;
        }

        html = insertProperty(html, "id", film.id);
        html = insertProperty(html, "name", film.name);
        html = insertProperty(html, "description", film.description);
        html = insertProperty(html, "year", film.year);
        html = insertProperty(html, "director", film.director);
      
    
        html = insertProperty(html, "genres_display", genresHtml);
        
        let imgUrl = film.imageUrl || ("categories/data/catalogs/images/" + film.id + ".jpg");
        html = insertProperty(html, "imageUrl", imgUrl);
     
   
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

    ns.loadGame = function() {
        $ajaxUtils.sendGetRequest("game.html", function(responseText) {
            insertHTML("#main-content", responseText);
            if (window.$game && typeof window.$game.init === "function") {
                window.$game.init();
            }
        }, false);
    };

    global.$ns = ns;

})(window);
