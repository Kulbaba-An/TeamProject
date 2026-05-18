(function(global) {
    const game = {};

    let canvas, ctx;
    let animationId;
    let score = 0;
    let isPlaying = false;
    let waitingForInput = false; // Чекаемо первого натиску
    let allFilms = []; // Store films data    let selectedLevel = 1; // Стандартно - нормальний рівень
    // Ball
    let ball = { x: 400, y: 400, dx: 2.5, dy: -2.5, radius: 8, speed: 2.5 };

    // Paddle
    let paddle = { height: 15, width: 120, x: 340, speed: 5 };

    // Bricks (based on films)
    let brickRowCount = 6;
    let brickColumnCount = 8;
    let brickWidth = 85;
    let brickHeight = 30;
    let brickPadding = 5;
    let brickOffsetTop = 50;
    let brickOffsetLeft = 15;
    let bricks = [];

    let rightPressed = false;
    let leftPressed = false;
    let levelType = 0; // Номер типу рівня

    game.init = function() {
        canvas = document.getElementById("gameCanvas");
        if (!canvas) return;
        ctx = canvas.getContext("2d");
        
        // Resize canvas for responsive design
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Load films via AJAX
        $ajaxUtils.sendGetRequest(
            "categories/data/films-catalog.json",
            function(data) {
                allFilms = data;
                brickRowCount = Math.ceil(allFilms.length / brickColumnCount);
            },
            true
        );

        const startBtn = document.getElementById("startGameBtn");
        startBtn.addEventListener("click", function() {
            if (!isPlaying && !waitingForInput) {
                // Показуємо вікно вибору рівня
                let levelContainer = document.getElementById("levelSelectContainer");
                if (levelContainer) levelContainer.style.display = "block";
                this.innerHTML = '<i class="bi bi-arrow-clockwise me-1"></i> Перезапустити';
            } else if (isPlaying) {
                cancelAnimationFrame(animationId);
                isPlaying = false;
                waitingForInput = false;
                let levelContainer = document.getElementById("levelSelectContainer");
                if (levelContainer) levelContainer.style.display = "none";
                game.drawStartScreen();
                this.innerHTML = '<i class="bi bi-play-circle me-1"></i> Почати гру';
            }
        });

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        
        // Touch support
        canvas.addEventListener("touchstart", touchHandler, false);
        canvas.addEventListener("touchmove", touchHandler, false);

        game.drawStartScreen();
    };

    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true;
            if (waitingForInput) startGame();
        }
        else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true;
            if (waitingForInput) startGame();
        }
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
        else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    }

    function touchHandler(e) {
        // Дотик контролює платформу тільки коли гра активна
        if (!isPlaying || e.touches.length === 0) return;
        
        let rect = canvas.getBoundingClientRect();
        let touchX = e.touches[0].clientX - rect.left;
        
        // Масштабуємо дотик з координат екрану на координати canvas
        let scaleX = canvas.width / rect.width;
        let canvasTouchX = touchX * scaleX;
        
        // Розраховуємо позицію платформи, щоб вона центрувалась на дотику
        let newPaddleX = canvasTouchX - (paddle.width / 2);
        
        // Дотримуємось меж canvas'а
        paddle.x = Math.max(0, Math.min(newPaddleX, canvas.width - paddle.width));
    }
    
    function resizeCanvas() {
        let container = canvas.parentElement;
        let maxWidth = Math.min(window.innerWidth - 20, 800);
        let ratio = canvas.width / canvas.height;
        
        canvas.style.width = maxWidth + "px";
        canvas.style.height = (maxWidth / ratio) + "px";
        
        // Оновлюємо позицію платформи при зміні розміру
        if (paddle.x + paddle.width > canvas.width) {
            paddle.x = canvas.width - paddle.width;
        }
    }

    game.selectLevel = function(level) {
        selectedLevel = level;
        let levelContainer = document.getElementById("levelSelectContainer");
        if (levelContainer) levelContainer.style.display = "none";
        game.reset();
        waitingForInput = true;
        game.drawWaitingScreen();
    };

    game.reset = function() {
        cancelAnimationFrame(animationId);
        score = 0;
        updateScore(score);
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 40;
        ball.dx = 0; // Міч не рухається до першого натиску
        ball.dy = 0;
        paddle.x = (canvas.width - paddle.width) / 2;
        levelType = selectedLevel; // Використовуємо вибраний користувачем рівень
        initBricks();
    };

    function initBricks() {
        bricks = [];
        
        // Вибрання конфігурації рівня на основі levelType
        configureLevelDifficulty();
        
        // Перемішуємо фільми для різноманітності
        let shuffledFilms = shuffleArray([...allFilms]);
        let filmIndex = 0;
        
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                if (filmIndex < shuffledFilms.length) {
                    bricks[c][r] = { 
                        x: 0, 
                        y: 0, 
                        status: 1,
                        film: shuffledFilms[filmIndex]
                    };
                    filmIndex++;
                } else {
                    bricks[c][r] = { x: 0, y: 0, status: 0 };
                }
            }
        }
    }
    
    function configureLevelDifficulty() {
        // Відповіди них рівням - різні конфігурації
        switch(levelType) {
            case 0: // Легкий рівень
                brickRowCount = 3;
                brickColumnCount = 6;
                brickWidth = 115;
                brickHeight = 30;
                brickPadding = 8;
                ball.speed = 2.5;
                paddle.speed = 5;
                break;
            case 1: // Нормальний рівень
                brickRowCount = 6;
                brickColumnCount = 8;
                brickWidth = 85;
                brickHeight = 30;
                brickPadding = 5;
                ball.speed = 2.5;
                paddle.speed = 5;
                break;
            case 2: // Тяжкий рівень
                brickRowCount = 8;
                brickColumnCount = 9;
                brickWidth = 75;
                brickHeight = 25;
                brickPadding = 3;
                ball.speed = 3.5;
                paddle.speed = 6;
                break;
            case 3: // Екстримально складний
                brickRowCount = 8;
                brickColumnCount = 10;
                brickWidth = 65;
                brickHeight = 22;
                brickPadding = 2;
                ball.speed = 4;
                paddle.speed = 7;
                break;
        }
    }
    
    function shuffleArray(array) {
        // Fisher-Yates shuffle алгоритм для випадкового перемішування
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function updateScore(s) {
        let scoreElem = document.getElementById("game-score");
        if (scoreElem) scoreElem.innerText = s;
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ffc107"; // Warning color (yellow)
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
        ctx.fillStyle = "#dc3545"; // Danger color (red)
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    
                    // Draw brick background
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    
                    // Movie theme colors based on category
                    let film = bricks[c][r].film;
                    if (film && film.category) {
                        if (film.category.includes("thriller")) ctx.fillStyle = "#dc3545"; // Red
                        else if (film.category.includes("comedy")) ctx.fillStyle = "#ffc107"; // Yellow
                        else if (film.category.includes("fantasy")) ctx.fillStyle = "#0d6efd"; // Blue
                        else if (film.category.includes("drama")) ctx.fillStyle = "#6f42c1"; // Purple
                        else if (film.category.includes("horror")) ctx.fillStyle = "#198754"; // Green
                        else ctx.fillStyle = "#6c757d"; // Gray
                    }
                    ctx.fill();
                    
                    // Draw border
                    ctx.strokeStyle = "#fff";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.closePath();
                    
                    // Draw film name
                    if (film) {
                        ctx.font = "bold 11px Arial";
                        ctx.fillStyle = "#fff";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        let text = film.name;
                        if (text.length > 15) text = text.substring(0, 12) + "...";
                        ctx.fillText(text, brickX + brickWidth / 2, brickY + brickHeight / 2);
                    }
                }
            }
        }
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status === 1) {
                    if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                        ball.dy = -ball.dy;
                        b.status = 0;
                        score++;
                        updateScore(score);
                        
                        if (score === allFilms.length) {
                            alert("ВІТАЄМО! ВИ ВИГРАЛИ!");
                            isPlaying = false;
                            game.drawStartScreen();
                            document.getElementById("startGameBtn").innerHTML = '<i class="bi bi-play-circle me-1"></i> Грати знову';
                        }
                    }
                }
            }
        }
    }

    function startGame() {
        waitingForInput = false;
        isPlaying = true;
        ball.dx = 2.5;
        ball.dy = -2.5;
        game.loop();
    }

    game.drawWaitingScreen = function() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        
        // Намалюємо інструкцію
        ctx.font = "20px 'Geologica', sans-serif";
        ctx.fillStyle = "rgba(255, 193, 7, 0.8)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Натисніть стрілку для початку!", canvas.width / 2, 30);
        
        // Показуємо складність рівня
        let levelNames = ["ЛЕГКО", "НОРМАЛЬНО", "ВАЖКО", "ЕКСТРИМ"];
        ctx.font = "16px 'Geologica', sans-serif";
        ctx.fillStyle = "rgba(100, 200, 255, 0.9)";
        ctx.fillText("Рівень: " + levelNames[selectedLevel], canvas.width / 2, canvas.height - 30);
        
        // М'яч рухається разом з платформою
        ball.x = paddle.x + paddle.width / 2;
        ball.y = canvas.height - 40;
    };

    game.drawStartScreen = function() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "30px 'Geologica', sans-serif";
        ctx.fillStyle = "#ffc107";
        ctx.textAlign = "center";
        ctx.fillText("Натисніть 'Почати гру'", canvas.width / 2, canvas.height / 2);
    };

    game.loop = function() {
        if (waitingForInput) {
            game.drawWaitingScreen();
            animationId = requestAnimationFrame(game.loop);
            return;
        }
        
        if (!isPlaying) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();

        if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
            ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy < ball.radius) {
            ball.dy = -ball.dy;
        } else if (ball.y + ball.dy > canvas.height - ball.radius) {
            if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                ball.dy = -ball.dy;
                // Angle depending on hit location on paddle
                let hitPoint = ball.x - (paddle.x + paddle.width / 2);
                ball.dx = hitPoint * 0.15;
            } else {
                isPlaying = false;
                alert("ГРА ЗАКІНЧЕНА. Ваш рахунок: " + score);
                game.drawStartScreen();
                document.getElementById("startGameBtn").innerHTML = '<i class="bi bi-play-circle me-1"></i> Почати гру';
                return;
            }
        }

        if (rightPressed && paddle.x < canvas.width - paddle.width) {
            paddle.x += paddle.speed;
        } else if (leftPressed && paddle.x > 0) {
            paddle.x -= paddle.speed;
        }

        ball.x += ball.dx;
        ball.y += ball.dy;

        if (isPlaying) {
            animationId = requestAnimationFrame(game.loop);
        }
    };

    global.$game = game;
})(window);
