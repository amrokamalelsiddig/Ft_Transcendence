import { appRouter } from './router.js';
import { fetchUserProfile } from './pong2.js';
import { createTournament, startTournament, getTournamentDetails, getFirstRound, getSecondRound, updateMatchResult, getNextMatch } from './tournamentApi.js';
import { inputElement, eventManager, checkInput } from './inputValidation.js';


const matchPoint = 11;
const paddleSpeed = 12;
let tournamentIntervalId;
let winner;
let winnerMsg;
let win;
let participants;
let creator;
let matchDetail;
let restartGameButton;
let startModal;
var restartModal;
var finishTournamentModal;
var matchModal;
let roundDetails;
let roundMsg, matchMsg;
let roundMatchPreview;
let gameOver;

let ballX;
let ballY;
let ballSpeedX;
let ballSpeedY;
let initialBallSpeedX;
let initialBallSpeedY;
let score1;
let score2;
let mainPlayer;
let player1Alias = "Player 1";
let player2Alias = "";
let initialPaddlePos;

let paddle1;
let paddle2;
let ball;
let board;
let score1Element;
let score2Element;
let player1AliasElement;
let player2AliasElement;

let begin = false;
let paddle1MovingUp = false;
let paddle1MovingDown = false;
let paddle2MovingUp = false;
let paddle2MovingDown = false;
let numParticipants = 0;
var detailsModal;

let gameInProgressTour = false;
let countdownIntervalIdPongTour;

export function startGameSession() {
  gameInProgressTour = true;
  window.addEventListener('beforeunload', handleBeforeUnload);
}

export function endGameSession() {
  gameInProgressTour = false;
  window.removeEventListener('beforeunload', handleBeforeUnload);
}
function handleBeforeUnload(event) {
  if (gameInProgressTour) {
    const message = "You have an ongoing game. Are you sure you want to leave and lose your progress?";
    event.returnValue = message;
    return message;
  }
}

function initVariables() {
  ballX = 10;
  ballY = 10;
  ballSpeedX = 5;
  ballSpeedY = 5;
  initialBallSpeedX = 10;
  initialBallSpeedY = 10;
  score1 = 0;
  score2 = 0;
  begin = false;
  paddle1MovingUp = false;
  paddle1MovingDown = false;
  paddle2MovingUp = false;
  paddle2MovingDown = false;
  tournamentIntervalId = null;
  gameOver = false;
  gameInProgressTour = false;
  participants = null;
  creator = null;
  matchDetail = null;
  roundMsg = "";
  matchMsg = "";
  winner = "";
  winnerMsg = "";
  roundMatchPreview = [];

  board = document.getElementById("board");
  paddle1 = document.getElementById("paddle_1");
  paddle2 = document.getElementById("paddle_2");
  initialPaddlePos = paddle1.style.top;
  ball = document.getElementById("ball");
  score1Element = document.getElementById("player_1_score");
  score2Element = document.getElementById("player_2_score");
  score1Element.textContent = score1;
  score2Element.textContent = score2;
  player1AliasElement = document.getElementById("player_1_alias");
  player2AliasElement = document.getElementById("player_2_alias");
  document.getElementById('player_2_alias').value = "";
  ballX = board.offsetWidth / 2 - ball.offsetWidth / 2;
  ballY = board.offsetHeight / 2 - ball.offsetHeight / 2;
}

function setupTournamentPage() {
  roundMatchPreview = [];
  initVariables();

  detailsModal = new bootstrap.Modal(document.getElementById('enterTournamentDetails'));
  startModal = new bootstrap.Modal(document.getElementById('startGameModal'));
  matchModal = new bootstrap.Modal(document.getElementById('gameDetailsModal'));

  detailsModal.show();

  const minusButton = document.querySelector('.quantity__minus');
  const plusButton = document.querySelector('.quantity__plus');
  const input = document.getElementById('numParticipants');

  function handleMinusButtonClick() {
    let value = parseInt(input.value, 10);
    value = Math.max(3, value - 1);
    input.value = value;
  }

  function handlePlusButtonClick() {
    let value = parseInt(input.value, 10);
    value = Math.min(value + 1, 8);
    input.value = value;
  }

  eventManager.addListener(minusButton, "click", handleMinusButtonClick);
  eventManager.addListener(plusButton, "click", handlePlusButtonClick);
  eventManager.addListener(continueBtn, "click", validateInputTournamentName);

  gameInProgressTour = false;
};

function handleNewTournamentFormSubmit() {
  const input = document.getElementById('numParticipants');
  numParticipants = parseInt(input.value, 10);
  detailsModal.hide();

  startModal.show();
  generateParticipantFields(numParticipants);
  const startGameBtn = document.getElementById('startGameBtn')
  eventManager.addListener(startGameBtn, "click", validateInputParticipants);
}

async function validateInputTournamentName(input) {
  const _elementBlock = [
    new inputElement('tournamentName', 'userName', true, 3, 10, "")
  ];
  if (!checkInput(_elementBlock)) {
    return;
  }
  handleNewTournamentFormSubmit();
}

async function validateInputParticipants() {
  const _elementBlock = [];

  for (var i = 0; i < numParticipants; i++) {
    if (i === 0) {
      _elementBlock.push(new inputElement('', '', !true, 69, 69, mainPlayer));
      continue;
    }
    _elementBlock.push(new inputElement(`input${i}`, 'userName', true, 3, 10, ""));
  }

  if (!checkInput(_elementBlock))
    return;
  setupcreateTournamentForm();
}

async function setupcreateTournamentForm() {
  gameInProgressTour = true;
  await createTournament();
  const details = await getTournamentDetails();
  startModal.hide();

  participants = details.participants;
  creator = details.creator;
  participants[0].username = creator.username;
  await startTournament();
  startGameLoop();

}


function generateParticipantFields(num) {
  const form = document.getElementById('participantDetailsForm');
  form.innerHTML = '';
  fetchUserProfile().then(data => {
    const formGroupUser = document.createElement('div');
    formGroupUser.classList.add('input-group');
    formGroupUser.classList.add('d-flex');
    formGroupUser.classList.add('flex-column');

    const labelUser = document.createElement('label');
    labelUser.textContent = `Participant 1 Name:`;
    formGroupUser.appendChild(labelUser);

    const inputUser = document.createElement('input');
    inputUser.type = 'text';
    inputUser.classList.add('form-control');
    inputUser.classList.add('rounded-1');
    inputUser.classList.add('generatedInput');
    inputUser.value = data.username;
    mainPlayer = data.username;
    inputUser.readOnly = true;
    inputUser.disabled = true;
    inputUser.id = `input0`;

    const invalidFeedback = document.createElement('div');
    invalidFeedback.className = 'invalid-feedback';
    invalidFeedback.textContent = 'Looks stinky! 🚽';

    const validFeedback = document.createElement('div');
    validFeedback.className = 'valid-feedback';
    validFeedback.textContent = 'Looks good! 🗿';
    formGroupUser.appendChild(inputUser);
    formGroupUser.appendChild(invalidFeedback);
    formGroupUser.appendChild(validFeedback);

    form.appendChild(formGroupUser);
    for (let i = 1; i < num; i++) {
      const formGroup = document.createElement('div');
      formGroup.classList.add('input-group');
      formGroup.classList.add('d-flex');
      formGroup.classList.add('flex-column');

      const label = document.createElement('label');
      label.textContent = `Participant ${i + 1} Name:`;
      formGroup.appendChild(label);

      const input = document.createElement('input');
      input.type = 'text';
      input.classList.add('form-control');
      input.classList.add('rounded-1');
      input.classList.add('generatedInput');
      input.placeholder = `Enter name for participant ${i + 1}`;
      input.required = true;
      input.name = `participantName${i}`;
      input.id = `input${i}`;
      const invalidFeedback = document.createElement('div');
      invalidFeedback.className = 'invalid-feedback';
      invalidFeedback.textContent = 'Looks stinky! 🚽';

      const validFeedback = document.createElement('div');
      validFeedback.className = 'valid-feedback';
      validFeedback.textContent = 'Looks good! 🗿';
      formGroup.appendChild(input);
      formGroup.appendChild(invalidFeedback);
      formGroup.appendChild(validFeedback);
      form.appendChild(formGroup);
    }
  });

};

function handleKeyDown(event) {
  if (event.key === "w" || event.key === "W") {
    paddle1MovingUp = true;
  } else if (event.key === "s" || event.key === "S") {
    paddle1MovingDown = true;
  } else if (event.key === "ArrowUp") {
    paddle2MovingUp = true;
  } else if (event.key === "ArrowDown") {
    paddle2MovingDown = true;
  }
};

function handleKeyUp(event) {
  if (event.key === "w" || event.key === "W") {
    paddle1MovingUp = false;
  } else if (event.key === "s" || event.key === "S") {
    paddle1MovingDown = false;
  } else if (event.key === "ArrowUp") {
    paddle2MovingUp = false;
  } else if (event.key === "ArrowDown") {
    paddle2MovingDown = false;
  }
};


function updateGame() {
  if (begin) {
    if (paddle1MovingUp && paddle1.offsetTop > 6) {
      paddle1.style.top = `${paddle1.offsetTop - paddleSpeed}px`;
    } else if (paddle1MovingDown && paddle1.offsetTop + paddle1.offsetHeight < (board.offsetHeight - 6)) {
      paddle1.style.top = `${paddle1.offsetTop + paddleSpeed}px`;
    }
    if (paddle2MovingUp && paddle2.offsetTop > 6) {
      paddle2.style.top = `${paddle2.offsetTop - paddleSpeed}px`;
    } else if (paddle2MovingDown && paddle2.offsetTop + paddle2.offsetHeight < (board.offsetHeight - 6)) {
      paddle2.style.top = `${paddle2.offsetTop + paddleSpeed}px`;
    }


    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX <= 0) {
      score2++;
      score2Element.textContent = score2;
      resetBall();
    } else if (ballX + ball.offsetWidth >= board.offsetWidth) {
      score1++;
      score1Element.textContent = score1;
      resetBall();
    }

    if (ballY <= 0 || ballY + ball.offsetHeight >= board.offsetHeight)
      ballSpeedY = -ballSpeedY;

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    const ballRect = ball.getBoundingClientRect();
    const paddle1Rect = paddle1.getBoundingClientRect();
    const paddle2Rect = paddle2.getBoundingClientRect();

    let paddleCollision =
      (ballRect.right >= paddle1Rect.left &&
        ballRect.left <= paddle1Rect.right &&
        ballRect.top <= paddle1Rect.bottom &&
        ballRect.bottom >= paddle1Rect.top &&
        ballSpeedX < 0) ||
      (ballRect.right >= paddle2Rect.left &&
        ballRect.left <= paddle2Rect.right &&
        ballRect.top <= paddle2Rect.bottom &&
        ballRect.bottom >= paddle2Rect.top &&
        ballSpeedX > 0);

    if (paddleCollision) {
      const ballCenterY = ballY + ball.offsetHeight / 2;
      const paddle1CenterY = paddle1.offsetTop + paddle1.offsetHeight / 2;
      const paddle2CenterY = paddle2.offsetTop + paddle2.offsetHeight / 2;
      let paddleCenterY;
      if (ballSpeedX < 0) {
        paddleCenterY = paddle1CenterY;
      } else {
        paddleCenterY = paddle2CenterY;
      }
      const collisionOffset = ballCenterY - paddleCenterY;
      const maxOffset = paddle1.offsetHeight / 2;
      const angle = collisionOffset / maxOffset;

      const paddle1BottomThreshold = board.offsetHeight - paddle1.offsetHeight / 2;
      const paddle2BottomThreshold = board.offsetHeight - paddle2.offsetHeight / 2;
      if ((paddle1.offsetTop > 6 && (paddle1.offsetTop + paddle1.offsetHeight) < (board.offsetHeight - 6))
        && (paddle2.offsetTop > 6 && (paddle2.offsetTop + paddle2.offsetHeight) < (board.offsetHeight - 6))) {
        if (
          (ballSpeedX < 0 && paddle1.offsetTop > paddle1BottomThreshold && angle > 0) ||
          (ballSpeedX > 0 && paddle2.offsetTop > paddle2BottomThreshold && angle > 0)
        ) {
          ballSpeedY = -initialBallSpeedY * Math.abs(angle);
        } else {
          ballSpeedY = initialBallSpeedY * angle;
        }
        ballSpeedX = -ballSpeedX;
      } else {
        if (paddle1.offsetTop > 6 || paddle2.offsetTop > 6)
          ballSpeedY = -(ballSpeedY + 2.1);
        if ((paddle1.offsetTop + paddle1.offsetHeight) < (board.offsetHeight - 2)
          || (paddle2.offsetTop + paddle2.offsetHeight) < (board.offsetHeight - 2))
          ballSpeedY = -(ballSpeedY + 2.5);
        ballSpeedX = -ballSpeedX;
      }
    }
    if (score1 === matchPoint || score2 === matchPoint) {
      haltGame(score1 === matchPoint ? player1Alias : player2Alias);
    }
  }
}

function haltGame(winning_player) {
  winner = winning_player;
  gameOver = true;
  endGameSession();
  winnerMsg = document.getElementById('GameWinner');
  winnerMsg.textContent = winning_player.toString() + " wins!";
  score1 = 0;
  score2 = 0;
  resetBall();
  begin = false;
  score1Element.textContent = score1;
  score2Element.textContent = score2;
  paddle1.style.top = initialPaddlePos;
  paddle2.style.top = initialPaddlePos;
  restartModal.show();
  clearInterval(tournamentIntervalId);
  tournamentIntervalId = null;
}

function resetBall() {
  ballX = board.offsetWidth / 2;
  ballY = board.offsetHeight / 2;
  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  const randomDirection = Math.random() < 0.5 ? -1 : 1;
  ballSpeedX = initialBallSpeedX * randomDirection;
  ballSpeedY = initialBallSpeedY * (Math.random() * 2 - 1);
}

function showCountdown(callback) {
  let count = 5;
  var countdownElement = document.getElementById('countdown');
  countdownElement.textContent = count;
  countdownElement.style.display = "block";
  countdownIntervalIdPongTour = setInterval(() => {
    count--;
    countdownElement.textContent = count;
    if (count === 0) {
      clearInterval(countdownIntervalIdPongTour);
      countdownElement.style.display = "none";
      callback();
    }
  }, 1000);
}

function cancelCountdown() {
  if (countdownIntervalIdPongTour) {
    clearInterval(countdownIntervalIdPongTour);
    document.getElementById('countdown').style.display = "none";
  }
}

function startGame() {
  restartModal = new bootstrap.Modal(document.getElementById('restartGame'));
  begin = true;
  gameOver = false;
  startGameSession();
  player1AliasElement.textContent = player1Alias;
  player2AliasElement.textContent = player2Alias;
  if (tournamentIntervalId) {
    clearInterval(tournamentIntervalId);
  }
  cancelCountdown();
  showCountdown(() => {
    tournamentIntervalId = setInterval(updateGame, 16);
    eventManager.addListener(document, "keydown", handleKeyDown);
    eventManager.addListener(document, "keyup", handleKeyUp);
  });
}

function hideOverflow() {
  const content = document.getElementsById('board');
  content.style.opacity = 1;
}

function waitGameFinish(interval = 100) {
  return new Promise(resolve => {
    const check = () => {
      if (gameOver) {
        resolve();
      } else {
        setTimeout(check, interval);
      }
    };
    check();

  })
}

async function getRoundDetails(round) {
  if (round == 1) {
    roundDetails = await getFirstRound();
    matchDetail = roundDetails.match_details;
  }
  else if (round == 2) {
    roundDetails = await getSecondRound();
    matchDetail = roundDetails.second_round_matches;
  }
}

function showRoundPreview(round, match, roundMsg = "") {
  if (roundMsg == "")
    roundMsg = "Round : " + round + "\n";
  for (let j = 0; j < matchDetail.length; j++) {
    let pl1 = participants.find(element => Object.values(element).includes(matchDetail[j].participant_one_id));
    let pl2;
    if (!matchDetail[j].is_bye)
      pl2 = participants.find(element => Object.values(element).includes(matchDetail[j].participant_two_id));
    if (matchDetail[j].is_bye && match == 0) {
      roundMatchPreview.push(pl1.username + " ADVANCES");
    }
    else if (!matchDetail[j].is_bye && match == 0) {
      roundMatchPreview.push(pl1.username + " vs " + pl2.username);
    }
    else {
      if (win && !matchDetail[j].is_bye && j < match) {
        if (win.username == pl1.username)
          roundMatchPreview[j] = '<span id="winnerColour">' + pl1.username + "</span>" + " vs " + '<span id="loserColour" class ="text-decoration-line-through">' + pl2.username + "</span>";
        else if (win.username == pl2.username)
          roundMatchPreview[j] = '<span id="loserColour" class ="text-decoration-line-through">' + pl1.username + "</span>" + " vs " + '<span id="winnerColour">' + pl2.username + "</span>";

      }
      else if (win && matchDetail[j].is_bye && j < match)
        roundMatchPreview[j] = '<span id="winnerColour">' + pl1.username + " ADVANCES" + "</span>";
      else
        roundMatchPreview[j] = matchDetail[j].is_bye ? pl1.username + " ADVANCES" : pl1.username + " vs " + pl2.username;
    }
    if (matchDetail[j].is_bye && match == j) {
      roundMatchPreview[j] = roundMatchPreview[j];
      match++;
      continue;
    }
    if (match == j && !matchDetail[j].is_bye)
      roundMatchPreview[j] = `>> ${roundMatchPreview[j]} <<`;
    else
      roundMatchPreview[j] = roundMatchPreview[j];
  }
  roundMsg = roundMsg + roundMatchPreview.join("\n")
  document.getElementById("gameDetail").innerHTML = roundMsg.replace(/\n/g, "<br>");

}
async function startGameLoop() {
  var p1, p2, remaining = 0, match_id, totalRounds, is_bye = false, matchesInRound;
  startModal.hide();
  if (participants.length > 4) {
    totalRounds = 3;
  }
  else
    totalRounds = 2;
  for (let i = 1; i <= totalRounds; i++) {
    try {
      await getRoundDetails(i);

      matchesInRound = matchDetail.filter(match => match.is_bye == false).length;
      for (let j = 0; j < matchesInRound; j++) {
        const data = await getNextMatch();
        p1 = participants.find(element => Object.values(element).includes(data.next_match.participant_one));
        p2 = participants.find(element => Object.values(element).includes(data.next_match.participant_two));
        if (i != totalRounds) {
          showRoundPreview(i, j);
          matchModal.show();
          await waitSubmission(startNextGameBtn);
        }
        else if (i == totalRounds) {
          roundMsg = "Round : " + i + "\n";
          matchMsg = ">> " + p1.username + " vs " + p2.username + " <<\n";
          roundMsg += matchMsg;
          document.getElementById("gameDetail").innerHTML = roundMsg.replace(/\n/g, "<br>");
          j = matchesInRound;
          matchModal.show();
          await waitSubmission(startNextGameBtn);
        }
        player1Alias = p1.username;
        player2Alias = p2.username;
        remaining = data.next_match.remaining_matches;
        match_id = data.next_match.match_id;

        startGame();

        await waitGameFinish();
        win = participants.find(element => Object.values(element).includes(winner));
        await updateMatchResult(match_id, win.id);
        restartGameButton = document.getElementById("restartGameBtn");
        await waitSubmission(restartGameButton);

      }
    } catch (error) {
      console.error('Failed to get next match:', error);
    }
    if (i != totalRounds) {
      matchModal.show();
      showRoundPreview(i, matchDetail.length, "Round " + i + " Finished!\n\n");
      await waitSubmission(startNextGameBtn);
    }
    roundMatchPreview = [];
  }

  var elem = document.getElementById('finishTournament');
  finishTournamentModal = new bootstrap.Modal(document.getElementById('finishTournament'));
  winnerMsg = document.getElementById('tournamentWinner');
  winnerMsg.textContent = win.username + " wins Tournament!";
  finishTournamentModal.toggle();
  gameInProgressTour = false;
  var restartTournament = document.getElementById("restartTournament");

  eventManager.addListener(restartTournament, "click", function () {

    finishTournamentModal.hide();
    restartModal.hide();
    appRouter.navigate('/tournament', { force: true });
  });
}

function waitSubmission(element) {
  return new Promise(resolve => {
    element.addEventListener('click', function onClick(event) {
      element.removeEventListener('click', onClick);
      resolve(event);
    });
  });
}

function setTournamentId(data) {
  localStorage.setItem('currentTournamentId', data.id);
}

function getTournamentId() {
  return localStorage.getItem('currentTournamentId');
}

export { setupTournamentPage, gameInProgressTour, setTournamentId, getTournamentId, tournamentIntervalId, countdownIntervalIdPongTour };
