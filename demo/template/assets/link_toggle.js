(function() {
  var currentActiveLink;

  var goTo = function(href) {
    var iframe = document.querySelector('#page-content');
    iframe.setAttribute('src', href);
    sessionStorage.setItem('currentPageLink', href);
  };

  document.addEventListener("DOMContentLoaded", function(event) {
    var link = sessionStorage.getItem('currentPageLink');
    const links = document.querySelectorAll('.doc-menu-link');
    if (link) {
      // load last viewed page
      for (var i = 0;i < links.length;i += 1) {
        if (links[i].getAttribute('href') === link) {
          currentActiveLink = links[i].parentElement;
          break;
        }
      }
      if (currentActiveLink) {
        goTo(link);
        currentActiveLink.className = 'doc-menu-item active';
      }
    }

    for (var i = 0;i < links.length;i += 1) {
      links[i].addEventListener('click', function(event) {
        event.preventDefault();
        goTo(this.getAttribute('href'));
        if (currentActiveLink) {
          currentActiveLink.className = 'doc-menu-item';
        }
        currentActiveLink = this.parentElement;
        currentActiveLink.className = 'doc-menu-item active';
      });
    }
  });
})();
