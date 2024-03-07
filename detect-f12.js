const button = document.querySelector('.click-link');
let workerUrl = "data:application/javascript;base64," + btoa(`self.addEventListener('message', (e) => {if(e.data==='hello'){self.postMessage('hello');}debugger;self.postMessage('');});`);
function checkIfDebuggerEnabled() {
  return new Promise((resolve) => {
    let fulfilled = false;
    let worker = new Worker(workerUrl);
    worker.onmessage = (e) => {
      let data = e.data;
      if (data === "hello") {
        setTimeout(() => {
          if (!fulfilled) {
            resolve(true);
            worker.terminate();
          }
        }, 1);
      } else {
        fulfilled = true;
        resolve(false);
        worker.terminate();
      }
    };
    worker.postMessage("hello");
  });
}
setInterval(() => {
  checkIfDebuggerEnabled().then((result) => {
    if (result) {
      window.location.href = "https://www.google.com/";
      setTimeout(() => {
        
      }, 10000);
      button.style.display = "none";
      // debugger;
      
    }
  });
}, 100);

document.onkeydown = function (event) {
  if (event.keyCode == 123) { // Mã phím F12
      return false;
  }
};
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.keyCode === 85) {
      // Chặn sự kiện khi Ctrl + U được ấn
      event.preventDefault();
      window.location.href = "https://www.google.com/";
  }
});
setInterval(() => {
  document.addEventListener('contextmenu', function (event) {
    // Chặn sự kiện chuột phải
    event.preventDefault();
  });
}, 100);
