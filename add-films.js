const fs = require('fs');
const path = require('path');

const filmsFile = path.join(__dirname, 'categories', 'data', 'films-catalog.json');
let films = JSON.parse(fs.readFileSync(filmsFile, 'utf8'));

const newFilms = [
  {
    "id": "9",
    "name": "Матриця",
    "category": ["sci-fi", "action"],
    "description": "Програміст Томас Андерсон дізнається, що реальний світ — це ілюзія, створена машинами, і приєднується до повстанців, щоб звільнити людство.",
    "year": 1999,
    "director": "Лана і Ліллі Вачовскі",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/b/ba/Poster_-_The_Matrix_Reloaded.jpg"
  },
  {
    "id": "10",
    "name": "Початок",
    "category": ["sci-fi", "thriller"],
    "description": "Професійний злодій, який краде корпоративні секрети за допомогою технології проникнення в сни, отримує завдання впровадити ідею в розум генерального директора.",
    "year": 2010,
    "director": "Крістофер Нолан",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/b/bc/Poster_Inception_film_2010.jpg"
  },
  {
    "id": "11",
    "name": "Інтерстеллар",
    "category": ["sci-fi", "drama"],
    "description": "Група дослідників вирушає крізь червоточину в космосі в пошуках нового дому для людства, яке опинилося на межі вимирання.",
    "year": 2014,
    "director": "Крістофер Нолан",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/uk/c/c3/Interstellar_2014.jpg"
  },
  {
    "id": "12",
    "name": "Темний лицар",
    "category": ["action", "thriller", "drama"],
    "description": "Коли загроза на ім'я Джокер сіє хаос у Ґотемі, Бетмен повинен пройти найважчі психологічні та фізичні випробування.",
    "year": 2008,
    "director": "Крістофер Нолан",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/8/83/Dark_knight_rises_poster.jpg"
  },
  {
    "id": "13",
    "name": "Кримінальне чтиво",
    "category": ["drama", "thriller"],
    "description": "Кілька переплетених історій про лос-анджелеських мафіозі, дрібних злочинців і таємничий чемоданчик.",
    "year": 1994,
    "director": "Квентін Тарантіно",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/9/93/Pulp_Fiction.jpg"
  },
  {
    "id": "14",
    "name": "Бійцівський клуб",
    "category": ["drama", "thriller"],
    "description": "Офісний працівник, який страждає від безсоння, і виробник мила створюють підпільний бійцівський клуб.",
    "year": 1999,
    "director": "Девід Фінчер",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/8/8a/Fight_club.jpg"
  },
  {
    "id": "15",
    "name": "Славні хлопці",
    "category": ["drama", "thriller"],
    "description": "Історія Генрі Гілла та його життя в мафії, що охоплює його відносини з дружиною Карен та його партнерами по злочинності.",
    "year": 1990,
    "director": "Мартін Скорсезе",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/5/54/Goodfellas.jpg"
  },
  {
    "id": "16",
    "name": "Втеча з Шоушенка",
    "category": ["drama"],
    "description": "Два ув'язнених чоловіка знаходять розраду і з часом спокутують провину завдяки актам звичайної порядності.",
    "year": 1994,
    "director": "Френк Дарабонт",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/1/11/The_Shawshank_Redemption.jpg"
  },
  {
    "id": "17",
    "name": "Хрещений батько",
    "category": ["drama", "thriller"],
    "description": "Старіючий патріарх організованої злочинної династії передає контроль над своєю підпільною імперією своєму синові.",
    "year": 1972,
    "director": "Френсіс Форд Коппола",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/c/c4/The_Godfather.jpg"
  },
  {
    "id": "18",
    "name": "Месники",
    "category": ["action", "sci-fi"],
    "description": "Найвизначніші герої Землі повинні зібратися разом і навчитися битися як одна команда, щоб зупинити пустотливого Локі.",
    "year": 2012,
    "director": "Джосс Відон",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/e/e6/The_Avengers_2012_poster.jpg"
  },
  {
    "id": "19",
    "name": "Аватар",
    "category": ["sci-fi", "action"],
    "description": "Морський піхотинець з параплегією, відправлений на місяць Пандора, розривається між виконанням наказів і захистом світу, який він відчуває своїм домом.",
    "year": 2009,
    "director": "Джеймс Кемерон",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/uk/4/4b/Avatar_poster_uk.jpg"
  },
  {
    "id": "20",
    "name": "Титанік",
    "category": ["drama", "romance"],
    "description": "Сімнадцятирічна аристократка закохується в доброго, але бідного художника на борту розкішного, але нещасливого R.M.S. Титанік.",
    "year": 1997,
    "director": "Джеймс Кемерон",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/f/f0/Titanic_1997_film_poster.jpg"
  },
  {
    "id": "21",
    "name": "Король Лев",
    "category": ["animation", "drama"],
    "description": "Левеня принц Сімба після смерті батька змушений покинути свій прайд, але згодом повертається, щоб відвоювати свій трон.",
    "year": 1994,
    "director": "Роджер Аллерс, Роб Мінкофф",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/uk/1/14/The_Lion_King_poster.jpg"
  },
  {
    "id": "22",
    "name": "Історія іграшок",
    "category": ["animation", "comedy"],
    "description": "Іграшка-ковбой глибоко загрожений та ревнує, коли в кімнаті з'являється нова фігурка космонавта, яка стає улюбленцем хлопчика.",
    "year": 1995,
    "director": "Джон Лассетер",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/uk/1/18/Toy_Story.jpg"
  },
  {
    "id": "23",
    "name": "У пошуках Немо",
    "category": ["animation", "comedy"],
    "description": "Після того, як його сина ловлять у Великому Бар'єрному рифі і відвозять до Сіднея, сором'язливий риба-клоун вирушає в подорож, щоб повернути його.",
    "year": 2003,
    "director": "Ендрю Стентон",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/uk/9/91/Finding_Nemo.jpg"
  },
  {
    "id": "24",
    "name": "Парк Юрського періоду",
    "category": ["sci-fi", "thriller"],
    "description": "Прагматичний палеонтолог, відвідуючи майже готовий тематичний парк, отримує завдання захистити двох дітей після того, як відключення електроенергії звільняє клонованих динозаврів.",
    "year": 1993,
    "director": "Стівен Спілберг",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/3/30/Jurassic_Park_poster.jpg"
  },
  {
    "id": "25",
    "name": "Термінатор 2",
    "category": ["sci-fi", "action"],
    "description": "Кіборг, ідентичний тому, що не зміг вбити Сару Коннор, тепер повинен захистити її підлітка-сина від ще більш просунутого і могутнього кіборга.",
    "year": 1991,
    "director": "Джеймс Кемерон",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/8/85/Terminator2poster.jpg"
  },
  {
    "id": "26",
    "name": "Назад у майбутнє",
    "category": ["sci-fi", "comedy"],
    "description": "Сімнадцятирічний учень випадково відправляється на тридцять років у минуле в подорожуючому в часі DeLorean, винайденому його близьким другом, вченим Доком Брауном.",
    "year": 1985,
    "director": "Роберт Земекіс",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/5/52/Back_to_the_future.jpg"
  },
  {
    "id": "27",
    "name": "Людина-павук: Навколо всесвіту",
    "category": ["animation", "action"],
    "description": "Підліток Майлз Моралес стає Людиною-павуком свого всесвіту і повинен об'єднатися з п'ятьма особами, які мають павучі здібності з інших вимірів, щоб зупинити загрозу для всіх реальностей.",
    "year": 2018,
    "director": "Боб Персічетті, Пітер Ремзі, Родні Ротман",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/b/b3/Spider-Man_Into_the_Spider-Verse.jpg"
  },
  {
    "id": "28",
    "name": "Коко",
    "category": ["animation", "fantasy"],
    "description": "Музикант-початківець Мігель, стикаючись з сімейною забороною на музику, потрапляє до Країни Мертвих, щоб знайти свого прадіда, легендарного співака.",
    "year": 2017,
    "director": "Лі Анкріч",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/uk/0/05/%D0%9A%D0%BE%D0%BA%D0%BE_%D0%BF%D0%BE%D1%81%D1%82%D0%B5%D1%80.jpg"
  },
  {
    "id": "29",
    "name": "Вгору",
    "category": ["animation", "drama"],
    "description": "78-річний Карл Фредріксен вирушає до Райського водоспаду на своєму будинку, оснащеному повітряними кулями, випадково взявши з собою молодого безбілетника.",
    "year": 2009,
    "director": "Піт Доктер",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/uk/4/4e/Up_%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D1%81%D1%8C%D0%BA%D0%B8%D0%B9_%D0%BF%D0%BE%D1%81%D1%82%D0%B5%D1%80.jpeg"
  },
  {
    "id": "30",
    "name": "Сяйво",
    "category": ["horror", "thriller"],
    "description": "Сім'я вирушає до ізольованого готелю на зиму, де лиха духовна присутність впливає на батька, змушуючи його до насильства.",
    "year": 1980,
    "director": "Стенлі Кубрик",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/1/1d/The_Shining_%281980%29_U.K._release_poster_-_The_tide_of_terror_that_swept_America_IS_HERE.jpg"
  },
  {
    "id": "31",
    "name": "Кошмар на вулиці В'язів",
    "category": ["horror"],
    "description": "Кілька підлітків стають мішенню Фредді Крюгера, серійного вбивці з обгорілим обличчям, який полює на них у їхніх снах.",
    "year": 1984,
    "director": "Уес Крейвен",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/c/ca/Nightmare_on_elm_street.jpg"
  },
  {
    "id": "32",
    "name": "Закляття",
    "category": ["horror", "thriller"],
    "description": "Дослідники паранормальних явищ Ед і Лоррейн Воррен допомагають сім'ї, яку тероризує темна присутність у їхньому фермерському будинку.",
    "year": 2013,
    "director": "Джеймс Ван",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/2/23/The_Conjuring_Poster.jpg"
  },
  {
    "id": "33",
    "name": "Шрек",
    "category": ["animation", "comedy"],
    "description": "Людожер на ім'я Шрек виявляє, що його болото захоплено казковими істотами, вигнаними лордом Фаркуадом.",
    "year": 2001,
    "director": "Ендрю Адамсон, Вікі Дженсон",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/ru/5/52/Shrek_movie_poster.jpg"
  }
];

films = films.concat(newFilms);
fs.writeFileSync(filmsFile, JSON.stringify(films, null, 2));
console.log('Successfully appended 25 new films.');
