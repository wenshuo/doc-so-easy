(function() {
  var reload = false;

  setInterval(function() {
    var url = !reload ? `/reload/yes` : '/reload/no';
    reload = true;
    console.log('check if reload is needed.');
    fetch(url, {
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
