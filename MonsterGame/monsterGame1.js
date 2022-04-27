/*
4/26
*/

const canvas= document.getElementById("myCanvas");
const context = canvas.getContext("2d");

// 타일
const tileType = ["justTile", "playerTile", "exitTile", "monsterTile", "shopTile"]
class Tile {
  constructor(left, top, right, bottom, color, tileType) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    // this.column = column;
    // this.row = row;
    this.color = color;
    this.tileType = "justTile"  }

  draw() {
    if(this.tileType == "justTile" || this.tileType == "exitTile" || this.tileType == "shopTile")
    {
      context.rect(this.left, this.top, tileWidth, tileHeight);
    }
    else if (this.tileType == "playerTile" || this.tileType == "monsterTile"){
      context.arc(this.left + arcRadius, this.top + arcRadius, arcRadius, 0, 2 * Math.PI);
    }
    context.fillStyle = this.color;
    context.fill();
  }
}

// 맵(타일)
const tileWidth = 40;
const tileHeight = 40;
const tileColumn = 9;
const tileRow = 9;
let tiles = [];

// 탈출구 관련
let exitColumn = Math.floor((Math.random() * 10)) % 8 + 1;
let exitRow = Math.floor((Math.random() * 10)) % 8 + 1;
let exit = {
  left: 0, right: 0, top: 0, bottom: 0
}

// 몬스터 관련
let monsterColumn = Math.floor((Math.random() * 10)) % 8 + 1;
let monsterRow = Math.floor((Math.random() * 10)) % 8 + 1;
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

// 키처리 함수 추가
document.addEventListener('keydown', keyDownEventHandler);

// 함수 실행
function keyDownEventHandler(e)
{
  // if (e.key == " " && setStart) {
  //   setInterval(update, 10)
  //   setStart = false
  // }
  
  if (e.key == "ArrowRight")
  {
    if(playerPosX < tileColumn -1)
    {
      playerPosX++;
      tiles[playerPosY][playerPosX-1].tileType="justTile"
      tiles[playerPosY][playerPosX-1].color="white"
    }
  }
  else if (e.key == "ArrowLeft")
  {
    if(playerPosX > 0)
    {
      playerPosX--;
      tiles[playerPosY][playerPosX+1].tileType="justTile"
      tiles[playerPosY][playerPosX+1].color="white"
    }
  }
  else if (e.key == "ArrowDown")
  {
    if(playerPosY < tileRow - 1)
    {
      playerPosY++;
      tiles[playerPosY - 1][playerPosX].tileType="justTile"
      tiles[playerPosY - 1][playerPosX].color="white"
    }
  }
  else if (e.key == "ArrowUp")
  {
    if(playerPosY > 0)
    {
      playerPosY--;
      tiles[playerPosY + 1][playerPosX].tileType="justTile"
      tiles[playerPosY + 1][playerPosX].color="white"
    }
  }
}

// 동작 감지
function update()
{
  if (isCollisionRectToRect(exit, player))
  {
    window.location.reload()
    alert("탈출 성공");
    // location.replace(location.href);
    // location.reload(true)
  }

  if (isCollisionRectToRect(monster, player))
  {
    alert("몬스터 등장");
    gameStart();
    playerPosX--;
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
  let exitTile = tiles[exitColumn][exitRow];

  exit.left = exitTile.left;
  exit.top = exitTile.top;
  exit.right = exitTile.right;
  exit.bottom = exitTile.bottom;
  exitTile.color = "black";
  exitTile.tileType = "exitTile"

  context.beginPath();
  exitTile.draw();
  context.closePath()
}

function drawMonster()
{
  let monsterTile = tiles[monsterColumn][monsterRow];

  monster.left = monsterTile.left;
  monster.top = monsterTile.top;
  monster.right = monsterTile.right;
  monster.bottom = monsterTile.bottom;
  monsterTile.color = "green";
  monsterTile.tileType = "monsterTile"

  
  context.beginPath();
  monsterTile.draw();
  context.closePath()
}

function drawPlayer()
{
  let playerTile = tiles[playerPosY][playerPosX];

  player.left = playerTile.left;
  player.top = playerTile.top;
  player.right = playerTile.right;
  player.bottom = playerTile.bottom;
  playerTile.color = "pink";
  playerTile.tileType = "playerTile"

  context.beginPath();
  playerTile.draw();
  context.closePath()
}

function gameRSPStart(inputNum){
  // inputRSPGame = prompt(" 가위 / 바위 / 보  중 하나를 입력하시오", "가위")
  
}

setTiles();
// draw();
setInterval(draw, 10);
setInterval(update, 10);