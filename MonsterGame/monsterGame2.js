/*

2022-04-26

- 가위바위보
1
*/

const canvas= document.getElementById("myCanvas");
const context = canvas.getContext("2d");
document.getElementById("gameBtn").style.display = "none";

// 타일
const tileType = ["justTile", "playerTile", "exitTile", "monsterTile", "shopTile", "forestTile"]
class Tile {
  constructor(left, top, right, bottom, color, tileType) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.color = color;
    this.tileType = "justTile"  }

  draw() {
    if(this.tileType == "justTile" || this.tileType == "exitTile" || this.tileType == "shopTile")
    {
      context.rect(this.left, this.top, tileWidth, tileHeight);
    }
    else if (this.tileType == "playerTile" || this.tileType == "monsterTile" || this.tileType == "forestTile"){
      context.arc(this.left + arcRadius, this.top + arcRadius, arcRadius, 0, 2 * Math.PI);
    }
    context.fillStyle = this.color;
    context.fill();
  }
}

// 플레이어
class Player {
  constructor(hp, gold){
    this.hp = hp;
    this.gold = gold;
  }
}


// 맵(타일)
const tileWidth = 40;
const tileHeight = 40;
const tileColumn = 9;
const tileRow = 9;
let tiles = [];
let prePos;

// 탈출구 관련
let exitColumn = Math.floor((Math.random() * 10)) % 8 + 1;
let exitRow = Math.floor((Math.random() * 10)) % 8 + 1;
let exit = {
  left: 0, right: 0, top: 0, bottom: 0
}

// 몬스터 관련
let randomNum = Math.floor((Math.random() * 10)) % 8 + 1;
let monsterColumn = Math.floor((Math.random() * 10)) % 8 + 1;
let monsterRow = Math.floor((Math.random() * 10)) % 8 + 1;
let forestColumn = Math.floor((Math.random() * 10)) % 8 + 1;
let forestRow = Math.floor((Math.random() * 10)) % 8 + 1;
let shopColumn = Math.floor((Math.random() * 10)) % 8 + 1;
let shopRow = Math.floor((Math.random() * 10)) % 8 + 1;
let forwhilevar = true;
while(forwhilevar) {
  if(monsterColumn == exitColumn == forestColumn == shopColumn && monsterRow == exitRow == forestRow == shopRow) {
    monsterColumn = Math.floor((Math.random() * 10)) % 8 + 1;
    monsterRow = Math.floor((Math.random() * 10)) % 8 + 1;
    forwhilevar = true;
  } else {
    forwhilevar = false;
  }
}
let monster = {
  left: 0, right: 0, top: 0, bottom: 0
}

// 플레이어 관련
const arcRadius = 20;
let playerPosX = 0;
let playerPosY = 0;
// let playerMovDirX = -1;
// let playerMOvDirY = -1;
let playerMovSpeed = 41; 
let player = {
  left: 0, right: 0, top: 0, bottom: 0
}
let playerState;


// 게임 관련
let gameState = 0;

// 키처리 함수 추가
document.addEventListener('keydown', keyDownEventHandler);

// 함수 실행
function keyDownEventHandler(e)
{
  // if (e.key == " " && setStart) {
  //   setInterval(update, 10)
  //   setStart = false
  // }
  let prePos = tiles[playerPosY][playerPosX];
  if (e.key == "ArrowRight")
  {
    if(playerPosX < tileColumn -1 && gameState == 0)
    {
      playerPosX++;
      prePos.tileType = "justTile";
      tiles[playerPosY][playerPosX-1].color="white"
      console.log(tiles)
    }
  }
  else if (e.key == "ArrowLeft")
  {
    if(playerPosX > 0 && gameState == 0)
    {
      playerPosX--;
      tiles[playerPosY][playerPosX+1].tileType="justTile"
      tiles[playerPosY][playerPosX+1].color="white"
    }
  }
  else if (e.key == "ArrowDown")
  {
    if(playerPosY < tileRow - 1 && gameState == 0)
    {
      playerPosY++;
      tiles[playerPosY - 1][playerPosX].tileType="justTile"
      tiles[playerPosY - 1][playerPosX].color="white"
    }
  }
  else if (e.key == "ArrowUp")
  {
    if(playerPosY > 0 && gameState == 0)
    {
      playerPosY--;
      tiles[playerPosY + 1][playerPosX].tileType="justTile"
      tiles[playerPosY + 1][playerPosX].color="white"
    }
  }
}

// 게임
function gameBtnDisappear(){
  document.getElementById("gameBtn").style.display = "none";
}

function gameBtnAppear(){
  document.getElementById("gameBtn").style.display = "block";
}

function gameRSPStart(inputNum){
  // inputRSPGame = prompt(" 가위 / 바위 / 보  중 하나를 입력하시오", "가위")
  battleNumber = Math.floor((Math.random() * 10)) % 3;
  // battleCoverage = Math.floor(Math.random() * 100);

  gameBtnAppear();
  console.log(gameState);

  if(((inputNum - battleNumber) + 2) % 3 == 0)
  {
    alert("가위 바위 보 승리");
    console.log("승리")
    gameState = 0;
    gameBtnDisappear();
    playerPosX = prePos;
  }
  else if(((inputNum - battleNumber) + 2) % 3 == 1)
  {
    alert("가위 바위 보 패배");
    console.log("패배");
    gameState = 0;
    gameBtnDisappear();
    playerPosX--;
  }
  else if(inputNum == battleNumber)
  {
    alert("무승부 입니다");
    gameState = 0;
    gameBtnDisappear();
    playerPosX--;
  }
}

// 동작 감지
function update()
{
  if (isCollisionRectToRect(exit, player))
  {
    window.location.reload()
    alert("탈출 성공");
  }

  if (isCollisionRectToRect(monster, player))
  {
  // alert("몬스터 등장");

    gameState = 1;
    // gameBtnAppear();
    gameRSPStart();
  }
}

// 충돌 처리
function isCollisionRectToRect(rectA, rectB)
{
  if(rectA.left > rectB.right ||
      rectA.right < rectB.left ||
      rectA.top > rectB.bottom ||
      rectA.bottom < rectB.top) 
    {
      return false;
    }
  return true;
}

function draw()
{
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawCanvas();
  drawTiles();
  drawExit();
  drawMonster();
  drawPlayer();
  drawForest();
  drawShop();
}

function drawCanvas()
{
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(10, 10, 10, 0.1)";
  context.fill();
  context.closePath();
}

function setTiles()
{
  for(let i = 0; i < tileColumn; i++)
  {
    tiles[i] = [];
    for(let j = 0; j < tileRow; j++)
    {
      tiles[i][j] = new Tile (15 + j * (tileWidth + 1),
                              15 + i * (tileHeight +1),
                              5 + j * (tileWidth + 1) + tileWidth,
                              5 + i * (tileHeight + 1) + tileHeight,
                              "white",
                              "justTile")
    }
  }
}

function drawTiles()
{
  for(let i = 0; i < tileColumn; i++)
  {
    for(let j = 0; j < tileRow; j++)
    {
      context.beginPath();
      tiles[i][j].draw();
      context.closePath()
    }
  }
  context.beginPath();
  context.closePath();
}

function drawExit()
{
  exit = tiles[exitColumn][exitRow];

  exit.color = "black";
  exit.tileType = "exitTile"
}

function drawMonster()
{
  monster = tiles[monsterColumn][monsterRow];

  monster.color = "green";
  monster.tileType = "monsterTile"
}

function drawPlayer()
{
  playerState = new Player (100, 0);
  player = tiles[playerPosY][playerPosX];

  player.color = "pink";
  player.tileType = "playerTile"
}

function drawForest()
{
  let forestTile = tiles[forestColumn][forestRow];

  forestTile.color = "sienna";
  forestTile.tileType = "exitTile"
}

function drawShop()
{
  let shopTile = tiles[shopColumn][shopRow];

  shopTile.color = "Yellow";
  shopTile.tileType = "shopTile"
}
setTiles();
// draw();
setInterval(draw, 10);
setInterval(update, 10);