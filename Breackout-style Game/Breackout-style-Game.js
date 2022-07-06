// 맨 뒤에 있어야하는 친구
var interval = setInterval( () => ( update ), 10);
gameStart()

//class는 객체의 설계도 역할
//명사로 지칭되는 객체를 설계한다. 자동차, 책, 몬스터, 사람 등의 속성과 기능을 함께 지정
class Brick { //명사
  constructor(left, top, right, bottom, color) { //속성종류
    this.left = left; //속성1
    this.top = top; //속성2
    this.right = right; //속성3
    this.bottom = bottom; //속성4
    this.color = color; //속성5
    this.isAlive = true; //속성6 
  }

  //class 내 그리기 함수
  draw() {
    if(this.isAlive)
    {
      context.rect(this.left, this.top, brickWidth, brickHeight); 
      context.fillStyle = this.color;
      context.fill();
    }
  }
}

//움직이면서 사라지지 않는 방해블록
class MovingBrick extends Brick {
  draw() {
    if(this.isAlive)
    {
      context.rect(this.left, this.top, brickWidth, brickHeight); 
      context.fillStyle = this.color;
      context.fill();
    }
  }

  move() {
    // movingBrick - canvas 접촉 시 방향전환
    if(this.left <= 0)
    {
      movingBrickDirX = 1;
    }
    else if(this.right - 50 >= canvas.width)
    {
      movingBrickDirX = -1;
    }
    //movingBrick 이동설정 (속도)
    this.left += movingBrickSpeed*movingBrickDirX;
    this.right += movingBrickSpeed*movingBrickDirX; 
  }

  isCollisionRectToRect(rectA)
  {  
    if(rectA.left > this.right ||
        rectA.right < this.left ||
        rectA.top > this.bottom ||
        rectA.bottom < this.top) 
      {
        return false;
      }
    return true;
  }
}

// 캔버스 생성
const canvas = document.getElementById('myCanvas'); 
const context = canvas.getContext('2d');


// 게임 진행 관련
let deadBrickCount = 0;

// 일반 벽돌 관련
const brickWidth = 50 // 가로벽돌 간격 10
const brickHeight = 25; // 세로 벽돌 간격 5
var inputBrickColumn;
var inputBrickRow;
let brickColumn = inputBrickColumn;  // 5행 세로로 
let brickRow = inputBrickRow ; // 5행 세로로 
let bricks = []
let countAliveBrick = brickColumn * brickRow; //남아있는 벽돌의 갯수

//방해 벽돌 관련
let movingBrick;
let movingBrickPosX = canvas.width / 2 - brickWidth
let movingBrickDirX = -1
let movingBrickSpeed = 3;

// 패들 관련
const barWidth = 100;
const barHeight = 20
let barPosX = canvas.width / 2 - barWidth / 2;
let barPosY = canvas.height - barHeight;
let barMovSpeed = 10;

let paddle = {
  left:0, right:0, top:0, bottom:0,
}

// 볼 관련
let ballDirL ;
let outBoundR = canvas.width / 2 + 50
let outBoundL = canvas.width / 2 - 50
const arcRadius = 20;
let arcPosX = barPosX + barWidth / 2;  // 공의 초기값
let arcPosY = 400 - 20 - arcRadius;
let arcMovDirX = -1;
let arcMovDirY = -1;
let arcMovSpeed = 2.5;

let ball = { 
  left:0, right:0, top:0, bottom:0,
};

// 키처리 함수 추가
document.addEventListener('keydown', keyDownEventHandler);


// 키보드 컨트롤
function keyDownEventHandler(e)
{
  if (e.key == 'ArrowRight')
  {
    if(barPosX + barWidth < canvas.width)
    {
      barPosX += barMovSpeed;

    }
  }
  else if (e.key == 'ArrowLeft')
  {
    if(barPosX > 0)
    {
      barPosX -= barMovSpeed;
    }
  }
  else if (e.code == 'Space') {
    setInterval(update, 10);

  }

  paddle.left = barPosX;
  paddle.right = barPosX + barWidth;
  paddle.top = barPosY;
  paddle.bottom = barPosY + barHeight;
}

//동작 감지
function update()
{
  // checkTowin();

  // ball - canvas 접촉 시 방향전환
  if(arcPosX - arcRadius < 0)
  {
    arcMovDirX = 1;
  }
  else if(arcPosX + arcRadius > canvas.width)
  {
    arcMovDirX = -1;
  }

  // ball - pallde 접촉 시 방향전환
  // if(arcPosY + arcRadius == canvas.height) {
  //   console.log('게임중지')
  //   gameOver();
  // }
  else if(arcPosY - arcRadius < 0)
  {
    arcMovDirY = 1;
  }
  else if(arcPosY + arcRadius > canvas.height)
  {
    arcMovDirY = -1;
  }
  
  //ball의 이동설정 (속도)
  arcPosX += arcMovDirX * arcMovSpeed;
  arcPosY += arcMovDirY * arcMovSpeed;

  //ball이 충돌시 접촉부분 계산 (반지름을 빼주어야 더욱 자연스러움 안하면 반지름만큼 넘어가서 인식)
  ball.left = arcPosX - arcRadius;
  ball.right = arcPosX + arcRadius;
  ball.top = arcPosY - arcRadius;
  ball.bottom = arcPosY + arcRadius;

  // ball - movingBrick 충돌체크
  if (movingBrick.isCollisionRectToRect(ball))
  {
    arcMovDirY = arcMovDirY*(-1);
    // if(){
    //   arcPosY = movingBrick.top - arcRadius;

    // }
    // else if(){
    //   arcPosY = movingBrick.top - arcRadius;

    // }

    //TODOLIST 충돌시 떨림 수정
  }

  // ball - paddle 충돌체크
  if (isCollisionRectToRect(ball, paddle))
  {
    arcMovDirY = -1;
    arcPosY = paddle.top - arcRadius;
  }

  // ball과 brick 충돌체크 
  for(let i = 0; i < brickRow; i++)
  {
    for(let j = 0; j < brickColumn; j++)
    {
      if(bricks[i][j].isAlive && isCollisionRectToRect(ball, bricks[i][j]))
      //살아있는 벽돌만 표시함
      {
        // console.log("i : ", i, "j : ", j); // 충돌 확인
        bricks[i][j].isAlive = false;  //충돌하면 사라짐
        countAliveBrick -= 1; //충돌할때마다 갯수차감
        // console.log('남아있는 벽돌 갯수 : ' + countAliveBrick);
        
        //남은 brcik이 없을때, 게임 클리어
        if( countAliveBrick == 0 ) {
          gameClearAlert();
        }
        arcMovDirY = -arcMovDirY;
        arcMovDirX = -arcMovDirX;
        break; //하나 충돌시 재로딩 될때까지는 break
      }
    }
  }
}

// ball과 paddle 충돌체크
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

// 사물 그리기
function draw()
{
  context.clearRect(0, 0, canvas.width, canvas.height); //초기화
  drawCanvas();
  drawRect(); //paddle
  drawArc(); //ball
  drawBricks(); //bricks
}

//Canvas 생성
function drawCanvas()
{
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(10, 10, 10, 0.1)";
  context.fill();
  context.closePath();
}

//ball 생성
function drawArc() 
{ 
  context.beginPath(); 
  context.arc(arcPosX, arcPosY, arcRadius, 0, 2 * Math.PI); 
  context.fillStyle = 'blue'; 
  context.fill(); 
  context.closePath(); 
}

//paddle 생성
function drawRect()
{
  context.beginPath(); 
  context.rect(barPosX, barPosY, barWidth, barHeight); 
  context.fillStyle = 'red'; 
  context.fill(); 
  context.closePath(); 
}

//brick 생성상세
function setBricks()
{
  //안사라지는 방해 블록 (100*20)
  movingBrick = new MovingBrick (150,190,250,210,'white');

  //사라질 수 있는 블록
  bricks = []
  for(let i = 0; i < brickRow; i++) //위에서 부터 n줄
  {
    bricks[i] = [];
    for(let j = 0; j < brickColumn; j++) // 가로로 n줄
    {
      // bricks[i][j] = {
      //   left: 55 + j * (brickWidth + 10),
      //   right:55 + j * (brickWidth + 10) + brickWidth,
      //   // right: this.left + 50,
      //   top: 30 + i * (brickHeight + 5),
      //   bottom: 30 + i * (brickHeight + 5) + brickHeight, //30 주는게 블럭이랑 간격크기 포함?
      //   column: i, row: j,
      //   isAlive:true
      // };

      bricks[i][j] = new Brick (55 + j * (brickWidth + 10),
                                30 + i * (brickHeight + 5),
                                55 + j * (brickWidth + 10) + brickWidth,
                                30 + i * (brickHeight + 5) + brickHeight,
                                'green')                          
    }
  }
}

// let flatBricks = bricks.flat();
// console.log(flatBricks)

//brick 갯수 카운트 (미사용)
function checkTowin(){
  // 1. brick 배열에 있는 정보로 처리
  let deadBricks = bricks.filter(brick => brick.isAlive == false);
  if (deadBricks.length == brickRow * brickColumn) {
  // 2. 카운트를 세는 변수를 만들어서 처리
    alert('게임 클리어22');
  }
}

//brick 그리기
function drawBricks()
{
  for(let i = 0; i < brickRow; i++) //위에서 부터 n줄
  {
    for(let j = 0; j < brickColumn; j++) // 가로로 n개
    {
      context.beginPath();
      bricks[i][j].draw();
      context.closePath(); // 밖에써서 색상 변경은 x 하려면 for문안에
    }
  }
  context.beginPath();
  movingBrick.draw();
  movingBrick.move();
  context.closePath(); // 밖에써서 색상 변경은 x 하려면 for문안에


}

//게임 시작
function gameStart(){
  inputBrickColumn = prompt(" 행 ", "5")
  inputBrickRow = prompt(" 열 ", "5")
}

//공 시작 방향
function ballDirInput(){
  
}

function gameClear(timeout){
  clearInterval(interval)
  // window.location.reload()
  arcMovSpeed = 0;
  setTimeout(() => {alert("게임 클리어!")} , timeout)
}

async function gameClearAlert(){
  await gameClear(3000);
}

function gameOver(){
  clearInterval(interval)
  window.location.reload()
  alert("게임 오버!")
}

setBricks();
setInterval(draw, 10);