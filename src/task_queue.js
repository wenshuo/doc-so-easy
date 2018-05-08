class TaskQueue {
  constructor() {
    this.tasks = [];
    this.running = false;
  }

  push(task) {
    this.tasks.push(task);
    this.processTasks();
  }

  processTasks() {
    if (!this.running) {
      this.running = true;
      this.run()
        .then(() => {
          this.running = false;
        }, () => {
          this.running = false;
        });
    }
  }

  async run() {
    let task;

    while(task = this.tasks.shift()) {
      try {
        console.log(`executing task: ${task.name}`)
        await task.fn();
      } catch (e) {
        console.log(e);
      }
    }
  }
}

module.exports = TaskQueue;
