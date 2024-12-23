// 全域變數宣告
let player1;
let player2;
let GAME_WIDTH;
let GAME_HEIGHT;
let hearts = []; // 儲存所有發射的愛心
let gameOver = false; // 新增遊戲結束狀態
let winner = null; // 新增獲勝者

function setup() {
  // 設置全螢幕
  GAME_WIDTH = windowWidth;
  GAME_HEIGHT = windowHeight;
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  
  // 初始化玩家1
  player1 = {
    x: 200,
    y: GAME_HEIGHT - 100,
    size: 50,
    speed: 8,
    health: 100,
    color: color(255, 182, 193),
    attacking: false,
    direction: 1 // 1表示向右, -1表示向左
  };
  
  // 初始化玩家2
  player2 = {
    x: GAME_WIDTH - 200,
    y: GAME_HEIGHT - 100,
    size: 50,
    speed: 8,
    health: 100,
    color: color(173, 216, 230),
    attacking: false,
    direction: -1
  };
}

function draw() {
  // 粉色漸層背景
  background(255, 218, 233);
  
  // 繪製TKU浮水印
  textSize(120);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(255, 255, 255, 50);
  text('TKU', width/2, height/2);
  
  // 繪製地面
  fill(255, 182, 193);
  rect(0, GAME_HEIGHT - 20, GAME_WIDTH, 20);
  
  // 更新和繪製愛心
  updateHearts();
  
  // 如果遊戲還沒結束，更新玩家位置
  if (!gameOver) {
    updatePlayers();
  }
  
  // 繪製玩家
  drawPlayer(player1);
  drawPlayer(player2);
  
  // 顯示血量
  drawHealth();
  
  // 檢查遊戲是否結束
  checkGameOver();
  
  // 如果遊戲結束，顯示結束畫面
  if (gameOver) {
    showGameOver();
  }
}

// 愛心類別
class Heart {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.speed = 10;
    this.direction = direction;
  }
  
  update() {
    this.x += this.speed * this.direction;
  }
  
  draw() {
    fill(255, 192, 203);
    noStroke();
    beginShape();
    vertex(this.x, this.y);
    bezierVertex(this.x + 15, this.y - 15, this.x + 30, this.y, this.x, this.y + 20);
    bezierVertex(this.x - 30, this.y, this.x - 15, this.y - 15, this.x, this.y);
    endShape();
  }
  
  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < player.size/2;
  }
}

function updateHearts() {
  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].update();
    hearts[i].draw();
    
    // 檢查是否擊中對手
    if (hearts[i].direction > 0 && hearts[i].hits(player2)) {
      player2.health = max(0, player2.health - 10);
      hearts.splice(i, 1);
    } else if (hearts[i].direction < 0 && hearts[i].hits(player1)) {
      player1.health = max(0, player1.health - 10);
      hearts.splice(i, 1);
    }
    
    // 移除超出畫面的愛心
    if (hearts[i] && (hearts[i].x < 0 || hearts[i].x > width)) {
      hearts.splice(i, 1);
    }
  }
}

function drawPlayer(player) {
  push(); // 保存當前繪圖狀態
  
  // 繪製圓形玩家
  fill(player.color);
  noStroke();
  ellipse(player.x, player.y, player.size);
  
  // 繪製可愛的眼睛
  fill(0);
  ellipse(player.x - 10, player.y - 5, 8);
  ellipse(player.x + 10, player.y - 5, 8);
  
  // 微笑
  noFill();
  stroke(0);
  strokeWeight(2);
  arc(player.x, player.y + 5, 20, 20, 0, PI);
  
  pop(); // 恢復繪圖狀態
}

function updatePlayers() {
  if (gameOver) return;
  
  // 玩家1控制 (WASD)
  if (keyIsDown(65)) { // A
    player1.x -= player1.speed;
    player1.direction = -1;
  }
  if (keyIsDown(68)) { // D
    player1.x += player1.speed;
    player1.direction = 1;
  }
  if (keyIsDown(87) && player1.y >= GAME_HEIGHT - 100) player1.y -= 20;  // W
  if (keyIsDown(32) && !player1.attacking) { // Space
    hearts.push(new Heart(player1.x, player1.y, player1.direction));
    player1.attacking = true;
  }
  if (!keyIsDown(32)) player1.attacking = false;
  
  // 玩家2控制 (方向鍵)
  if (keyIsDown(LEFT_ARROW)) {
    player2.x -= player2.speed;
    player2.direction = -1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player2.x += player2.speed;
    player2.direction = 1;
  }
  if (keyIsDown(UP_ARROW) && player2.y >= GAME_HEIGHT - 100) player2.y -= 20;
  if (keyIsDown(ENTER) && !player2.attacking) {
    hearts.push(new Heart(player2.x, player2.y, player2.direction));
    player2.attacking = true;
  }
  if (!keyIsDown(ENTER)) player2.attacking = false;
  
  // 重力
  player1.y = min(player1.y + 8, GAME_HEIGHT - 60);
  player2.y = min(player2.y + 8, GAME_HEIGHT - 60);
  
  // 邊界檢查
  player1.x = constrain(player1.x, 25, width - 25);
  player2.x = constrain(player2.x, 25, width - 25);
}

function drawHealth() {
  // ���家1血量
  fill(255, 182, 193);
  rect(20, 20, player1.health * 2, 20);
  
  // 玩家2血量
  fill(173, 216, 230);
  rect(width - 220, 20, player2.health * 2, 20);
}

function windowResized() {
  GAME_WIDTH = windowWidth;
  GAME_HEIGHT = windowHeight;
  resizeCanvas(GAME_WIDTH, GAME_HEIGHT);
}

// 新增遊戲結束檢查函數
function checkGameOver() {
  if (player1.health <= 0) {
    gameOver = true;
    winner = "藍色玩家";
  } else if (player2.health <= 0) {
    gameOver = true;
    winner = "粉色玩家";
  }
}

// 新增遊戲結束畫面
function showGameOver() {
  // 半透明背景
  fill(0, 0, 0, 127);
  rect(0, 0, width, height);
  
  // 遊戲結束文字
  textSize(64);
  textAlign(CENTER, CENTER);
  fill(255);
  text('遊戲結束!', width/2, height/2 - 40);
  
  // 顯示獲勝者
  textSize(32);
  text(winner + ' 獲勝!', width/2, height/2 + 20);
  
  // 重新開始提示
  textSize(24);
  text('按下 R 鍵重新開始', width/2, height/2 + 80);
  
  // 檢查是否按下 R 鍵重新開始
  if (keyIsDown(82)) { // R鍵的keyCode是82
    resetGame();
  }
}

// 新增重置遊戲函數
function resetGame() {
  // 重置玩家1
  player1.health = 100;
  player1.x = 200;
  player1.y = GAME_HEIGHT - 100;
  
  // 重置玩家2
  player2.health = 100;
  player2.x = GAME_WIDTH - 200;
  player2.y = GAME_HEIGHT - 100;
  
  // 清空所有愛心
  hearts = [];
  
  // 重置遊戲狀態
  gameOver = false;
  winner = null;
}
  