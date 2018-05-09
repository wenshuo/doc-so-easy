(function() {
  setInterval(function() {
    console.log('check if reload is needed.');
    fetch('/reload', {
      method: 'GET'
    })
    .then((res) => res.json())
    .then(res => {
      if (res.reload) {
        location.reload();
      }
    })
    .catch((e) => {
      console.log(e);
    });
  }, 2000);
})();
