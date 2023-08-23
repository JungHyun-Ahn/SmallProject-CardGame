// === Variables ===
const NUMBER_OF_CARD = 16;
const LIMIT_TIME_SEC = 60;

let isStart = false;
let cardDeck = [];
let cardOne, cardTwo;
let isFullFlip = false;
let matchCount = 0;
let timer;

const cardsContainer = document.querySelector(".cards");
const leftTime = document.querySelector(".leftTime");
const popUpBox = document.querySelector(".popUpBox");
const retryBtn = document.querySelector(".popUpBox .retry button");

window.addEventListener('load', () => {
  startGame();
});

retryBtn.addEventListener('click', () => {
  closePopUp();
  startGame();
});

// === Functions ===

// 게임 시작
function startGame() {
  isStart = true;
  matchCount = 0;
  cardsContainer.style.pointerEvents = 'auto';
  const cardDeck = createCard();
  console.log(cardDeck);
  settingCard(cardDeck);

  cardsContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains('card')) {flipCard(e)};
  });
  startTimer();
}

// 게임 종료
function stopGame(isWin) {
  isStart = false;
  if(isWin) {
    showPopUp('😎WIN😎');
  } else {
    showPopUp('😂LOSE😂');
    cardsContainer.style.pointerEvents = 'none';
  }
}

// 카드 생성
function createCard() {
  let randNum;
  let randIdArr = [];
  cardDeck = []
  for(let i = 0; i < NUMBER_OF_CARD; i++) {
    randNum = Math.floor(Math.random() * NUMBER_OF_CARD);
    if(!randIdArr.includes(randNum)) {
      randIdArr.push(randNum);
    } else {
      i--;
    }
  }
  randIdArr.map((id) => (
    cardDeck.push({id})
  )) 
  return cardDeck;
}

// 화면에 카드 세팅
function settingCard(cardDeck) {
  let str = '';
  cardDeck.forEach((card) => {
    str += `
    <div data-id="${card.id}" data-flip="false" class="card">
      <div class="front">
        <img src="./images/frontImg(${card.id < NUMBER_OF_CARD / 2 ? card.id + 1 : NUMBER_OF_CARD - card.id}).png" alt="">
      </div>
      <div class="back">
        <img src="./images/backImg.png" alt="">
      </div>
    </div>
    `
  });
  cardsContainer.innerHTML = str;
}

// 카드 뒤집기
function flipCard({target: clickedCard}) {
  if(clickedCard.dataset.flip == "false" && clickedCard !== cardOne && !isFullFlip) {
    clickedCard.classList.add('flip');
    if(!cardOne) {
      cardOne = clickedCard;
    } else if(cardOne && !cardTwo) {
      cardTwo = clickedCard;
      isFullFlip = true;
    }
    isFullFlip && matchCard(cardOne.dataset.id, cardTwo.dataset.id);
  } 
}

// 카드 짝 맞추기
function matchCard(cardOneId, cardTwoId) {
  const isMatched = Number(cardOneId) + Number(cardTwoId) === NUMBER_OF_CARD - 1 ? true : false;
  if(isMatched) {
    matchCount += 2;
    if(matchCount === NUMBER_OF_CARD) {
      stopTimer();
      stopGame(true);
    }
    console.log("right")
    cardOne.dataset.flip = "true";
    cardTwo.dataset.flip = "true";
    isFullFlip = false;
    cardOne = cardTwo = "";
    return;
  } 
  console.log("wrong")
  setTimeout(() => {
    cardOne.classList.remove('flip');
    cardTwo.classList.remove('flip');
  }, 1000);
  setTimeout(() => {
    isFullFlip = false;
    cardOne = cardTwo = "";
  }, 1000);
}

// timer 시작
function startTimer() {
  let remainTime = LIMIT_TIME_SEC;
  updateLeftTime(remainTime);
  timer = setInterval(() => {
    if(remainTime <= 0) {
      stopTimer();
      stopGame(matchCount === NUMBER_OF_CARD);
      return;
    }
    updateLeftTime(--remainTime);
  }, 1000);
}

// timer 정지
function stopTimer() {
  clearInterval(timer);
  timer = null;
}

// timer 남은 시간 update
function updateLeftTime(remainTime) {
  let min = Math.floor(remainTime / 60);
  let sec = remainTime % 60;
  leftTime.innerText = `${min} : ${sec < 10 ? '0' + sec : sec}`;
}

// popUp 보이기
function showPopUp(text) {
  popUpBox.querySelector('h3').innerText = text;
  popUpBox.style.display = 'block';
}

// popUp 닫기
function closePopUp() {
  popUpBox.style.display = 'none';
}
