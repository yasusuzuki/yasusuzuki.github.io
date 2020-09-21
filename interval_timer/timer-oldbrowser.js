// Credit: Mateusz Rybczonec

const WARMUP_THRESHOLD = 15;
const WORKOUT_THRESHOLD = 45;
const WARNING_THRESHOLD = 5;
const REST_THRESHOLD = 25;

const ROUND = 10;

const COLOR_CODES = {
  workout: {
    name: "workout",
    color: "red",
    time: WORKOUT_THRESHOLD
  },
  warning: {
    name: "warning",
    color: "orange",
  },
  rest: {
    name: "rest",
    color: "green",
    time: REST_THRESHOLD,
  },
  warmup: {
    name: "warmup",
    color: "grey",
    time: WARMUP_THRESHOLD
  }

};

const MENU_LIST = [
"バーピージャンプ １５回",
"スクワット　３０回",
"ももあげ　３０回",
"ジャンプ　40回",
"プランク　１分",
"腹筋 30回",
"腕立て 15回",
"ボクシングジャブ　1分",
"膝をついたまま腕立て　１分"

];


var round = 1;
var countdown = null;
var audio=0;
var warning_timer = null;
var stage = COLOR_CODES.warmup;

audiojs.events.ready(function() {
    audio=audiojs.createAll();
});

countdown = $("#countdown").countdown360({
     radius      : 200.5,
     seconds     : stage.time,
     strokeWidth : 50,
     fillStyle   : 'white',
     strokeStyle : stage.color,
     fontSize    : 200,
     fontColor   : stage.color,
     autostart   : false,
     smooth      : true,
     onComplete  : onTimesUp

});

$("#button_reset").prop("disabled",true);

var sound = null;
$("#button_start").on('click',function(){
  countdown.start();
  $("#button_start").prop("disabled",true);
  $("#button_stop").prop("disabled",false);

  //redraw round for restart
  $("#base-timer-round").text(round + "/" + ROUND + " " + MENU_LIST[round-1]);
  sound = document.getElementById("Sound");
  //Needs to play sound via user interaction in advance.
  //TODO: how to avoid playing sound at this time.
  sound.play();

});

$("#button_stop").on('click',function(){
  countdown.stop();
  clearTimeout(warning_timer);

  countdown.pen.strokeStyle = COLOR_CODES.warmup.color;
  countdown.settings.fontColor = COLOR_CODES.warmup.color;
  countdown.settings.seconds = COLOR_CODES.warmup.time;
  stage = COLOR_CODES.warmup;
  round = 1;

  $("#button_start").prop("disabled",false);
  $("#button_stop").prop("disabled",true);
});


$("#base-timer-round").text(round + "/" + ROUND + " " + MENU_LIST[round-1]);

function onTimesUp(){
  //Switch between workout and rest round
  if (stage.name === "workout") {
    //update color from workout to warning
    stage = COLOR_CODES.rest;
    $("#base-timer-round").text( (round+1) + "/" + ROUND + " " + MENU_LIST[round]);

  } else if (stage.name === "rest"){
    stage = COLOR_CODES.workout;
    round++;

    warning_timer =setTimeout(setWarning,(WORKOUT_THRESHOLD - WARNING_THRESHOLD)*1000);
  } else if (stage.name === "warmup"){
    stage = COLOR_CODES.workout;
    warning_timer =setTimeout(setWarning,(WORKOUT_THRESHOLD - WARNING_THRESHOLD)*1000);
  }

  if ( round > ROUND ){
    $("#base-timer-round").text("CLEAR !!!");
  }else{

    console.log(stage.color);
    countdown.stop();
    countdown.pen.strokeStyle = stage.color;
    countdown.settings.fontColor = stage.color;
    countdown.settings.seconds = stage.time;
    countdown.start();
  }
}

function setWarning() {
  console.log("setWarning");
  countdown.pen.strokeStyle = COLOR_CODES.warning.color;
  countdown.settings.fontColor = COLOR_CODES.warning.color;
  clearTimeout(warning_timer);
  sound.play();
}
