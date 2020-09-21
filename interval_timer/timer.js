// Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 283;

const WARMUP_THRESHOLD = 15;

const WORKOUT_THRESHOLD = 50;
const WARNING_THRESHOLD = 8;

const REST_THRESHOLD = 20;

const ROUND = 8

const COLOR_CODES = {
  workout: {
    color: "red"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  rest: {
    color: "green",
  },
  warmup: {
    color: "grey",
  }

};


let round = 1;
let roundLeft = ROUND;
let timeLeft = WARMUP_THRESHOLD;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.warmup.color;

document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>

</div>
<div id="base-timer-round" class="base-timer__label">WARM UP!!</div>
`;

  typeOfThisRound = "warmup";
  timeLimitOnThisRound = WARMUP_THRESHOLD;
  startTimer();
  var music = new Audio('Ship_Bell-Mike_Koenig-1911209136.mp3');
  music.play();  // 再生


function onTimesUp(){
  //Switch between workout and rest round
  if (typeOfThisRound === "workout") {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(COLOR_CODES.workout.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(COLOR_CODES.warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(COLOR_CODES.rest.color);
    typeOfThisRound = "rest";
    timeLeft = REST_THRESHOLD;
    timeLimitOnThisRound = REST_THRESHOLD;
  } else if (typeOfThisRound === "rest"){
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(COLOR_CODES.rest.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(COLOR_CODES.workout.color);
    typeOfThisRound = "workout";
    timeLeft = WORKOUT_THRESHOLD;
    timeLimitOnThisRound = WORKOUT_THRESHOLD;
    round++;
  } else if (typeOfThisRound === "warmup"){
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(COLOR_CODES.warmup.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(COLOR_CODES.workout.color);
    typeOfThisRound = "workout";
    timeLeft = WORKOUT_THRESHOLD;
    timeLimitOnThisRound = WORKOUT_THRESHOLD;

  }

  if ( round > ROUND ){
    clearInterval(timerInterval);
    document.getElementById("base-timer-round").innerHTML = `CLEAR !!!`;

  }else{
    document.getElementById("base-timer-round").innerHTML = `ROUND ${round}/${ROUND}`;
    clearInterval(timerInterval);
    startTimer();
  }
}

function startTimer() {

  timerInterval = setInterval(() => {
    timeLeft = timeLeft - 1;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  if (typeOfThisRound === "workout" && timeLeft <= COLOR_CODES.warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(COLOR_CODES.workout.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(COLOR_CODES.warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / timeLimitOnThisRound;
  return rawTimeFraction - (1 / timeLimitOnThisRound) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}
