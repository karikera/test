const readline = require('readline');

// readline 인터페이스 생성
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let computerNumber;
let tryCount = 0;
const MAX_TRIES = 9;

// 게임 시작
function startGame() {
  console.log('숫자 야구 게임을 시작합니다!');
  computerNumber = generateRandomNumber();
  // console.log(`컴퓨터가 생성한 숫자: ${computerNumber.join('')}`); // 디버깅용
  askQuestion();
}

// 3자리 중복없는 숫자 생성
function generateRandomNumber() {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const result = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result.push(numbers.splice(randomIndex, 1)[0]);
  }
  return result;
}

// 사용자에게 질문
function askQuestion() {
  if (tryCount >= MAX_TRIES) {
    console.log(`시도 횟수(${MAX_TRIES}번)를 모두 사용했습니다. 정답은 ${computerNumber.join('')} 입니다.`);
    rl.close();
    return;
  }

  rl.question('세 자리 숫자를 입력하세요: ', (userInput) => {
    if (!isValidInput(userInput)) {
      console.log('잘못된 입력입니다. 중복되지 않는 세 자리 숫자를 입력해주세요.');
      askQuestion();
      return;
    }

    tryCount++;
    const userGuess = userInput.split('').map(Number);
    const result = checkGuess(userGuess, computerNumber);

    if (result.strikes === 3) {
      console.log(`축하합니다! ${tryCount}번 만에 숫자를 맞추셨습니다!`);
      rl.close();
    } else {
      console.log(`${result.strikes} 스트라이크, ${result.balls} 볼 입니다. (남은 기회: ${MAX_TRIES - tryCount}번)`);
      askQuestion();
    }
  });
}

// 입력값 유효성 검사
function isValidInput(input) {
  if (!/^\d{3}$/.test(input)) {
    return false;
  }
  const digits = input.split('');
  const uniqueDigits = new Set(digits);
  return digits.length === uniqueDigits.size;
}

// 추측 확인
function checkGuess(guess, answer) {
  let strikes = 0;
  let balls = 0;

  for (let i = 0; i < 3; i++) {
    if (guess[i] === answer[i]) {
      strikes++;
    } else if (answer.includes(guess[i])) {
      balls++;
    }
  }

  return { strikes, balls };
}

// readline 종료 이벤트 핸들러
rl.on('close', () => {
  console.log('게임을 종료합니다.');
  process.exit(0);
});

// 게임 시작
startGame();
