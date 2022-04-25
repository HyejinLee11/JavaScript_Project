/*

탈출 게임(1차)
1. 맵 제작 2차원 배열
2. 맵 타입 오브젝트 or class
3. 플레이어, 탈출구 - 오브젝트 or 클래스
4. 키 입력 처리 - 상하좌우 1칸씩 이동 가능
5. 플레이어가 탈출구에 도착하면 게임 클리어

*/

// 캔버스 생성
const canvas= document.getElementById("myCanvas");
const context = canvas.getContext("2d");

// 타일(class 타입으로 생성)
class Tile {
  constructor(left, top, right, bottom, color) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.color = color;
  }

  draw() {
    context.rect(this.left, this.top, tileWidth, tileHeight);
    context.fillStyle = this.color;
    context.fill();
  }
}

// 맵(타일)
const tileWidth = 40; // 가로 타일 간격 5?
const tileHeight = 40;
const tileColumn = 9;
const tileRow = 9;
let tiles;

// 탈출구 관련
let exitColumn = Math.floor((Math.random() * 10)) % 8 + 1;
let exitRow = Math.floor((Math.random() * 10)) % 8 + 1;
let exit = {
  left: 0, right: 0, top: 0, bottom: 0
}

// 플레이어 관련
const playerRadius = 20;
let playerPosX = playerRadius + 15;
let playerPosY = playerRadius + 15;
let playerMovSpeed = 41; 
let player = {
  left: 0, right: 0, top: 0, bottom: 0
}

// 키처리 함수 추가
document.addEventListener('keydown', keyDownEventHandler);

// 함수 실행
function keyDownEventHandler(e)
{
  if (e.key == "ArrowRight")
  {
    if(playerPosX + playerRadius < canvas.width - 30 )
    {
      playerPosX += playerMovSpeed;
    }
  }
  else if (e.key == "ArrowLeft")
  {
    if(playerPosX - playerRadius > 15)
    {
      playerPosX -= playerMovSpeed;
    }
  }
  else if (e.key == "ArrowDown")
  {
    if(playerPosY + playerRadius < canvas.height - 30)
    {
      playerPosY += playerMovSpeed;
    }
  }
  else if (e.key == "ArrowUp")
  {
    if(playerPosY - playerRadius > 15)
    {
      playerPosY -= playerMovSpeed;
    }
  }

  player.left = playerPosX - playerRadius;
  player.right = playerPosX + playerRadius;
  player.top = playerPosY - playerRadius;
  player.bottom = playerPosY + playerRadius;
}

// 동작 감지
function update()
{
  if (isCollisionRectToRect(exit, player))
  {
    alert("탈출 성공");
    window.location.reload()
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

// 함수 실행
function draw()
{
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawCanvas();
  drawTiles();
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

function drawPlayer()
{
  context.beginPath();
  context.arc(playerPosX, playerPosY, playerRadius, 0, 2 * Math.PI);
  context.fillStyle = "pink";
  context.fill();
  context.closePath();
}

function setTiles()
{
  // 맵
  tiles = []
  for(let i = 0; i < tileRow; i++)
  {
    tiles[i] = [];
    for(let j = 0; j < tileColumn; j++)
    {
      tiles[i][j] = new Tile (15 + j * (tileWidth + 1),
                                15 + i * (tileHeight +1),
                                5 + j * (tileWidth + 1) + tileWidth,
                                5 + i * (tileHeight + 1) + tileHeight,
                                "white")
    }
  }
  // 탈출구
  let exitTile = tiles[exitColumn][exitRow];
  exitTile.color = "black";

  exit.left = exitTile.left;
  exit.top = exitTile.top;
  exit.right = exitTile.right;
  exit.bottom = exitTile.bottom;
}

function drawTiles()
{
  for(let i = 0; i < tileRow; i++)
  {
    for(let j = 0; j < tileColumn; j++)
    {
      context.beginPath();
      tiles[i][j].draw();
      context.closePath()
    }
  }
  context.beginPath();
  context.closePath();
}

setTiles();
setInterval(draw, 10);
setInterval(update, 10);

