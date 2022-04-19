/*
  캔버스설정
  documunet
  context
*/

const canvas = document.getElementById('myCanvas'); // html 리턴된다. document 내에서 바뀌는 내용이 아니므로 let할 필요없음.
// document는 
const context = canvas.getContext('2d');

const arcRadius = 20;
let arcPosX = canvas.width / 2 + 100; // 계속 바껴야하니까 let으로 지정
let arcPosY = canvas.height / 2;
let arcMovDirX = -1;
let arcMovDirY = -1;
let arcMovSpeed = 1;

let ball = { // 충돌을 위해 처리할 상하좌우 // 위치정보, 스피드 정도, 볼이가지고 있는 모든 정보를 포함한 객체가 된다. // 언제 움직이는지? 움직일때마다 바뀜.
  left:0, right:0, top:0, bottom:0,
};

const barWidth = 100;
const barHeight = 20
let barPosX = canvas.width / 2 - barWidth / 2;
let barPosY = canvas.height - barHeight;
let barMovSpeed = 10;

let paddle = { // 계속 바뀜
  left:0, right:0, top:0, bottom:0,
}

document.addEventListener('keydown', keyDownEventHandler);
document.addEventListener('keyup', keyUpEventHandler);

function keyDownEventHandler(e) // 매개변수를 넣어주면 document가 무슨킨지 알려줌.
{
  if (e.key == 'ArrowRight')
  {
    // 바를 오른쪽으로 이동
    if(barPosX + barWidth < canvas.width)
    {
      barPosX += barMovSpeed;

    }
  }
  else if (e.key == 'ArrowLeft')
  {
    // 바를 왼쪽으로 이동
    if(barPosX > 0)
    {
      barPosX -= barMovSpeed;
    }
  }

  paddle.left = barPosX;
  paddle.right = barPosX + barWidth;
  paddle.top = barPosY;
  paddle.bottom = barPosY + barHeight;
}

function keyUpEventHandler(e)
{

}

function update()
{
  //데이터 수정 (도형의 위치 이동)
  if(arcPosX - arcRadius < 0)
  {
    arcMovDirX = 1;
  }
  else if(arcPosX + arcRadius > canvas.width)
  {
    arcMovDirX = -1;
  }

  if(arcPosY - arcRadius < 0)
  {
    arcMovDirY = 1;
  }
  else if(arcPosY + arcRadius > canvas.height)
  {
    arcMovDirY = -1;
  }
  arcPosX += arcMovDirX * arcMovSpeed;
  arcPosY += arcMovDirY * arcMovSpeed;

  ball.left = arcPosX - arcRadius;
  ball.right = arcPosX + arcRadius;
  ball.top = arcPosY - arcRadius;
  ball.bottom = arcPosY + arcRadius;

  //충돌확인
  if (isCollisionRectToRect(ball, paddle))
  {
    arcMovDirY = -1;
    arcPosY = paddle.top - arcRadius;
  }
}

function isCollisionRectToRect(rectA, rectB)
{
  // a의 왼쪽과 b의 오른쪽
  // a의 오른쪽과 b의 왼쪽
  // a의 아래쪽과 b의 위쪽
  // a의 위쪽과 b의 아래쪽
  if(rectA.left > rectB.right ||
      rectA.right < rectB.left ||
      rectA.top > rectB.bottom ||
      rectA.bottom < rectB.top) // 하나라도 만족하면 안겹침 (그림 그리면 이해하기 쉬움)
    {
      return false;
    }
  return true;
}

function draw()
{
  //화면 클리어
  context.clearRect(0, 0, canvas.width, canvas.height); //화면을 네모난 모양으로 지워준다. 좌상단 캔버스 크기만큼
  drawCanvas();

  // 다른 도형 크리기
  drawRect();
  drawArc();
}

function drawCanvas()
{
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(10, 10, 10, 0.1)";
  context.fill();
  context.closePath();
}

function drawArc() // 컴파일 순간에 함수니까 컴파일 단계에서 정해져있고 setInterval에서 호출될 때 실행
{ 
  context.beginPath(); // 그리기 시작

  // context.arc(canvas.width / 2 ,  canvas.height / 2 , 50, 0, 2 * Math.PI); // 원을 그림. 원의 중점으로 시작. 크기 50에 스타트앵글 0, 각도(파이*2는 360)
  context.arc(arcPosX, arcPosY, arcRadius, 0, 2 * Math.PI); // 원을 그림. 원의 중점으로 시작. 크기 50에 스타트앵글 0, 각도(파이*2는 360)

  context.fillStyle = 'blue'; // 스타일 설정
  context.fill(); // 그려줌

  context.closePath(); // 그리기 종료
}

function drawRect()
{
  context.beginPath(); // 그리기 시작

  // context.rect(canvas.width / 2, canvas.height / 2, 100, 100); //캔버스 기준 화면 가운데 좌표 크기는 100
  context.rect(barPosX, barPosY, barWidth, barHeight); //좌상단 부터 시작. 캔버스 기준 화면 가운데 좌표보다 50만큼 더 좌상단으로 감. 크기는 100 
  
  context.fillStyle = 'red'; // 스타일 설정
  context.fill(); // 그려줌
  
  context.closePath(); // 그리기 종료
}



// rect와 arc의 시작점이 어딘지 명확하게 알면 됨. rect는 좌상단, arc는 중앙 그래서 겹치려면 arc 50뺴는걸 안하면 됨.
// 함수 하나에 여러가지 기능이 섞여있어서 나눠주는게 좋음.
setInterval(update, 10); //0.01초
setInterval(draw, 10); //0.01초



// 실습. 동그라미가 오른쪽으로 움직이다가 캔버스 끝에 닿으면 왼쪽으로 이동