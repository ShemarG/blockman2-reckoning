class Timer {
  constructor(duration, callback, callbackArg, timerEndEvt) {
    this.initialDuration = duration;
    this.timeLeft = duration;
    this.currentTimer = null;
    this.callback = callback;
    this.callbackArg = callbackArg;
    this.timerEndEvt = new CustomEvent(timerEndEvt);
  }

  getHours() {
    const base = this.timeLeft;
    return Math.floor(base / 3600);
  }

  getMinutes() {
    let base = this.timeLeft;
    base -= this.getHours() * 3600;
    return Math.floor(base / 60);
  }

  getSeconds() {
    let base = this.timeLeft;
    base -= this.getHours() * 3600;
    base -= this.getMinutes() * 60;
    return base;
  }

  tick() {
    if (this.timeLeft === 0) {
      clearInterval(this.currentTimer);
      this.currentTimer = null;
      document.dispatchEvent(this.timerEndEvt);
    }
    if (this.callback) this.callback(this.callbackArg);
    this.timeLeft -= 1;
  }

  startTimer() {
    if (this.currentTimer !== null) clearInterval(this.currentTimer);
    this.currentTimer = setInterval(this.tick.bind(this), 1000);
  }

  pauseTimer() {
    clearInterval(this.currentTimer);
  }

  resetTimer() {
    if (this.currentTimer) {
      clearInterval(this.currentTimer);
      this.currentTimer = null;
    } else {
      this.timeLeft = this.initialDuration;
    }
  }
}
