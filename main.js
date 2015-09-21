T = (function() {
  'use strict'


  var date = new Date();

  var timeElapsed = [];
  var timeStarted = 0;
  var started = false;

  var sumReduce = function(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce(function(a, b) {
      return a + b;
    });
  };

  var leadingZero = function(num) {
    num = num + "";
    return (num.length === 1) ? "0" + num : num;
  }

  var startTimer = function(startTime) {
    started = true;
    timeStarted = (typeof startTime !== 'undefined') ? startTime : Date.now();
    return timeStarted;
  };

  var getTime = function() {
    if (started)
      return sumReduce(timeElapsed.concat(
        [Date.now() - timeStarted]));
    else
      return sumReduce(timeElapsed);
  };

  var stopTimer = function(dummyTime) {
    if (typeof dummyTime === "undefined")
      timeElapsed.push(new Date().getTime() - timeStarted);
    else
      timeElapsed.push(dummyTime - timeStarted);
    started = false;
    return getTime();
  }

  var formatTime = function(time) {
    var date = new Date(time);
    var out = leadingZero(date.getMinutes()) + ":";
    out += leadingZero(date.getSeconds()) + ":";
    out += leadingZero(Math.floor(date.getMilliseconds()/10))
    return out;
  }


  var reset = function() {
    started = false;
    timeElapsed = [];
  }

  return {
    timeStarted: timeStarted,
    timeElapsed: timeElapsed,
    startTimer: startTimer,
    getTime: getTime,
    stopTimer: stopTimer,
    formatTime: formatTime,
    reset: reset
  };
}());

  (function() {
    var buttons = document.getElementsByClassName('button');
    var timeUpdater;
    buttons[0].addEventListener('click', function() {
      if (buttons[0].innerHTML === 'start') {
        buttons[0].innerHTML = 'stop';
        T.startTimer();
        timeUpdater = setInterval(function() {
          document.getElementById('time').innerHTML = T.formatTime(T.getTime());
        }, 20);
      } else {
        clearInterval(timeUpdater);
        T.stopTimer();
        buttons[0].innerHTML = 'start';
      }
    });
    buttons[1].addEventListener('click', function() {
      buttons[0].innerHTML = 'start';
      clearInterval(timeUpdater);
      T.stopTimer();
      T.reset();
      document.getElementById('time').innerHTML = T.formatTime(T.getTime());
    });
  })();

  test('timer at zero before start', function(assert) {
    console.log(1);
    assert.deepEqual(T.timeElapsed, [], 'Message: timer is zero at start' );
  });

  test( "The timer returns start time when given", function() {
    var startTime = new Date().getTime();
    equal( T.startTimer(startTime), startTime, true );
  });

  test( "format milliseconds correctly", function(assert) {
    assert.deepEqual(T.formatTime(1000), "00:01:00");
  });

  test("timer resets", function() {
    T.reset()
    equal(T.getTime(), 0, true);
  })

  T.reset();

  test("stop, start, stop", function(assert) {
    T.startTimer(1000);
    T.stopTimer(2000);
    T.startTimer(0);
    T.stopTimer(10);
    equal(1010, T.getTime());
  });



  // console.log("time moving forward test:")
  var startTime = new Date().getTime();
  startTime = T.startTimer(startTime);
  window.setTimeout(function() {
    test( "time moves forward", function() {
      console.log(3);
      equal(T.getTime() > 0, true, true );
    });
    T.reset();

    T.startTimer(new Date().getTime());
    var stopTime = T.stopTimer();
    window.setTimeout(function() {
      test( "timer stops", function() {
        console.log(4);
        equal(stopTime, T.getTime(), true );
      });
    },100);

  },100);

  T.reset();
