/*

2022-04-26

- 가위바위보
1
*/

const canvas= document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const hpSpan = document.getElementById('hp');
const goldSpan = document.getElementById('gold');
document.getElementById("gameBtn").style.display = "none";

// 타일
const tileType = ["justTile", "playerTile", "exitTile", "monsterTile", "shopTile", "forestTile"]
class Tile {
  constructor(iX, iY, color, tileType) {
    this.iX = iX;
    this.iY = iY;
    this.color = color;
    this.tileType = "justTile"
  }

  draw() {
    if(this.tileType == "justTile" || this.tileType == "exitTile" || this.tileType == "shopTile")
    {
      context.rect(15 + this.iX * (tileWidth + 1), 15 + this.iY * (tileHeight +1), tileWidth, tileHeight);
    }
    else if (this.tileType == "playerTile" || this.tileType == "monsterTile" || this.tileType == "forestTile"){
      context.arc(15 + this.iX * (tileWidth + 1) + arcRadius, 15 + this.iY * (tileHeight +1) + arcRadius, arcRadius, 0, 2 * Math.PI);
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

// battle 관련 변수
let battleResult;
let battleNumber;
var inputNumber;
let battleCoverage;

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
let exit;

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
  if(monsterColumn == exitColumn && monsterRow == exitRow) {
    monsterColumn = Math.floor((Math.random() * 10)) % 8 + 1;
    monsterRow = Math.floor((Math.random() * 10)) % 8 + 1;
    forwhilevar = true;
  } else {
    forwhilevar = false;
  }
}
let monster;

// 플레이어 관련
const arcRadius = 20;
let playerPosX = 0;
let playerPosY = 0;
// let playerMovDirX = -1;
// let playerMOvDirY = -1;
let playerMovSpeed = 41; 
let player;
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
  // // }
  // player;
  if (e.key == "ArrowRight")
  {
    if(playerPosX < tileColumn -1 && gameState == 0)
    {
      playerPosX++;
      player.tileType = "justTile";
      player.color="white"
      // console.log(tiles)
    }
  }
  else if (e.key == "ArrowLeft")
  {
    if(playerPosX > 0 && gameState == 0)
    {
      playerPosX--;
      player.tileType="justTile"
      player.color="white"
    }
  }
  else if (e.key == "ArrowDown")
  {
    if(playerPosY < tileRow - 1 && gameState == 0)
    {
      playerPosY++;
      player.tileType="justTile"
      player.color="white"
    }
  }
  else if (e.key == "ArrowUp")
  {
    if(playerPosY > 0 && gameState == 0)
    {
      playerPosY--;
      player.tileType="justTile"
      player.color="white"
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
    playerState.gold += battleCoverage;
    goldSpan.innerText = `gold : ${playerState.cash}`;
    playerPosX--;
  }
  else if(((inputNum - battleNumber) + 2) % 3 == 1)
  {
    alert("가위 바위 보 패배");
    console.log("패배");
    gameState = 0;
    gameBtnDisappear();
    playerState.hp -= 1;
    console.log(playerState.hp)
    hpSpan.innerText = `hp : ${playerState.hp}`;
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
  if (isCollisionInXToInY(exit, player))
  {
    window.location.reload()
    alert("탈출 성공");
  }

  if (isCollisionInXToInY(monster, player))
  {
  // alert("몬스터 등장");

    gameState = 1;
    // gameBtnAppear();
    gameRSPStart();
  }
}

// 충돌 처리
function isCollisionInXToInY(tileA, tileB)
{
  if( tileA.iX == tileB.iX && tileA.iY == tileB.iY)
  {
    return true;
  }
  return false;
}

function draw()
{
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawCanvas();
  drawTiles();
  drawForest();
  drawShop();
  drawMonster();
  drawPlayer();
  drawExit();
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
      tiles[i][j] = new Tile (i, j, "white", "justTile")
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
  player = tiles[playerPosX][playerPosY];

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
// update();
setInterval(draw, 10);
setInterval(update, 10);