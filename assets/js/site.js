/*
 * Enkode site shell.
 *
 * Every page contains only its own content. The parts that repeat on every page
 * are rendered here by four custom elements:
 *
 *   <site-header>  logo, main menu, social icons
 *   <site-footer>  copyright, address, recent posts
 *   <post-list>    post index for blog.html, filtered by ?tag= or ?category=
 *   <post-nav>     previous / next links at the bottom of a post
 *
 * It also runs the home page slider and the back-to-top button, and forwards old tag links.
 * No libraries and no build step: load posts.js and this file in <head>.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * Site settings: edit the menu, address and social links here.
   * ------------------------------------------------------------------ */
  var SITE = {
    name: 'Enkode LLC',
    address: ['Desert Ridge', 'Phoenix, AZ 85054'],
    menu: [
      { label: 'Home', href: 'index.html' },
      {
        label: 'Portfolio',
        href: 'enkode-portfolio.html',
        children: [
          { label: 'Web Applications', href: 'web-application-services.html' },
          { label: 'Logo Designs', href: 'logo-designs.html' },
          { label: 'Resume', href: 'software-engineer-resume.html' }
        ]
      },
      { label: 'Services', href: 'web-application-services.html' },
      { label: 'Contact', href: 'contact.html' }
    ],
    // "icon" is the header sprite, "footerIcon" the smaller footer version (omit to leave it out of the footer).
    social: [
      { label: 'Github', href: 'https://github.com/enkodellc', icon: 'follow_icon7.png' },
      { label: 'Stack Overflow', href: 'https://stackoverflow.com/users/1452739/enkode', icon: 'follow_icon6.png' },
      { label: 'Facebook', href: 'https://www.facebook.com/Enkode.LLC', icon: 'follow_icon1.png', footerIcon: 'social_icon1.png' },
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/User:Enkode', icon: 'follow_icon8.png' },
      { label: 'Blog', href: 'blog.html', icon: 'follow_icon3.png', footerIcon: 'social_icon3.png', internal: true },
      { label: 'Pinterest', href: 'https://www.pinterest.com/enkode/', icon: 'follow_icon4.png', footerIcon: 'social_icon4.png' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/enkode-llc', icon: 'follow_icon5.png', footerIcon: 'social_icon5.png' }
    ]
  };

  // Site root, worked out from where this script was loaded (<root>/assets/js/site.js),
  // so the same markup works from the root, from /post/, from a sub-folder or from file://.
  var ROOT = new URL('../../', document.currentScript.src).href;
  var POSTS = window.ENKODE_POSTS || [];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function url(path) {
    return ROOT + path;
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  // '2016-03-30T13:08' -> 'March 30, 2016 13:08'
  function formatDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso);
    if (!m) return iso;
    return MONTHS[+m[2] - 1] + ' ' + m[3] + ', ' + m[1] + ' ' + m[4] + ':' + m[5];
  }

  function postUrl(post) {
    return url('post/' + post.slug + '.html');
  }

  function tagUrl(tag) {
    return url('blog.html?tag=' + encodeURIComponent(tag.toLowerCase()));
  }

  function categoryUrl(category) {
    return url('blog.html?category=' + encodeURIComponent(category.toLowerCase()));
  }

  // Tag links on the old site looked like /?tag=/material+design; send them to the blog page.
  var oldTag = /[?&]tag=\/([^&]+)/.exec(window.location.search);
  if (oldTag) {
    try {
      window.location.replace(tagUrl(decodeURIComponent(oldTag[1].replace(/\+/g, ' '))));
    } catch (e) { /* malformed address: stay on this page */ }
  }

  function define(name, render) {
    if (!window.customElements || customElements.get(name)) return;
    customElements.define(name, class extends HTMLElement {
      connectedCallback() {
        if (this.dataset.rendered) return;
        this.dataset.rendered = 'true';
        render(this);
      }
    });
  }

  /* ------------------------------ header ------------------------------ */

  function menuHtml() {
    return SITE.menu.map(function (item) {
      var children = item.children || [];
      var sub = children.length
        ? '<ul>' + children.map(function (child) {
            return '<li><a href="' + url(child.href) + '">' + esc(child.label) + '</a></li>';
          }).join('') + '</ul>'
        : '';
      return '<li>' +
        '<a href="' + url(item.href) + '"' + (children.length ? ' aria-haspopup="true"' : '') + '>' +
        '<strong>' + esc(item.label) + '</strong><span></span>' +
        (children.length ? '<em class="indicator1"></em>' : '') +
        '</a>' + sub + '</li>';
    }).join('');
  }

  // Small screens get a native <select>, as the original theme did.
  function mobileMenuHtml() {
    var options = '<option value="">Navigate to...</option>';
    SITE.menu.forEach(function (item) {
      options += '<option value="' + url(item.href) + '">' + esc(item.label) + '</option>';
      (item.children || []).forEach(function (child) {
        options += '<option value="' + url(child.href) + '">&nbsp;&nbsp;&ndash; ' + esc(child.label) + '</option>';
      });
    });
    return '<select class="select-menu" aria-label="Site navigation">' + options + '</select>';
  }

  function socialHtml(footer) {
    return SITE.social.filter(function (s) {
      return !footer || s.footerIcon;
    }).map(function (s) {
      var external = s.internal ? '' : ' target="_blank" rel="noopener"';
      var href = s.internal ? url(s.href) : s.href;
      return '<li><a href="' + href + '"' + external + ' title="' + esc(s.label) + '">' +
        '<img src="' + url('assets/img/' + (footer ? s.footerIcon : s.icon)) + '" alt="Enkode ' + esc(s.label) + '"></a></li>';
    }).join('');
  }

  define('site-header', function (host) {
    host.innerHTML =
      '<header id="header">' +
        '<div class="container">' +
          '<div class="navbar-brand navbar-brand_">' +
            '<a href="' + url('index.html') + '"><img alt="' + esc(SITE.name) + '" src="' + url('assets/img/Enkode-Logo.png') + '" width="280"></a>' +
          '</div>' +
          '<div class="rightside">' +
            '<div class="menuheader">' +
              '<nav class="navbar navbar-default navbar-static-top tm_navbar" aria-label="Main">' +
                '<ul class="nav sf-menu">' + menuHtml() + '</ul>' +
                mobileMenuHtml() +
              '</nav>' +
            '</div>' +
            '<div class="socialheader"><ul class="social_icons clearfix">' + socialHtml(false) + '</ul></div>' +
          '</div>' +
        '</div>' +
      '</header>';

    host.querySelector('.select-menu').addEventListener('change', function () {
      if (this.value) window.location.href = this.value;
    });
  });

  /* ------------------------------ footer ------------------------------ */

  define('site-footer', function (host) {
    var recent = POSTS.map(function (post) {
      return '<li><a href="' + postUrl(post) + '">' + esc(post.title) + '</a></li>';
    }).join('');

    host.innerHTML =
      '<footer>' +
        '<div class="footerrow1"><div class="container"><div class="row">' +
          '<div class="col-lg-8 col-md-8 col-sm-8 fright"><div class="row">' +
            '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 footercol1">' +
              '<p class="title4">our Location</p>' +
              '<div class="smalladdress">' +
                '<p class="mainaddress">' + SITE.address.map(esc).join('<br>') + '</p>' +
              '</div>' +
            '</div>' +
            '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 footercol1">' +
              '<div class="widget recentposts">' +
                '<div class="widgetTitle">Recent Posts</div>' +
                '<div class="content"><ul class="recentPosts">' + recent + '</ul></div>' +
              '</div>' +
            '</div>' +
          '</div></div>' +
          '<div class="col-lg-4 col-md-4 col-sm-4 fleft"><div class="row">' +
            '<div class="col-lg-12 col-md-12 col-sm-12 footercol2">' +
              '<p class="title4">copyright</p>' +
              '<p class="footerpriv">' + esc(SITE.name) + ' &copy; <span>' + new Date().getFullYear() + '</span> ' +
                '<img src="' + url('assets/img/line3.png') + '" alt=""> ' +
                '<a class="privacylink" href="' + url('privacy-policy.html') + '">Privacy Policy</a></p>' +
              '<ul class="social2 clearfix">' + socialHtml(true) + '</ul>' +
            '</div>' +
          '</div></div>' +
        '</div></div></div>' +
      '</footer>';
  });

  /* ---------------------------- post list ----------------------------- */

  function postMetaHtml(post) {
    return '<div class="subtitle">' +
      '<time datetime="' + esc(post.date) + '">' + formatDate(post.date) + '</time> ' +
      '<span class="author">Posted by <a href="' + url('blog.html') + '">keith</a></span>' +
      (post.category
        ? ' <span class="category">Filed Under <a href="' + categoryUrl(post.category) + '">' + esc(post.category) + '</a></span>'
        : '') +
      '</div>';
  }

  function tagsHtml(post) {
    if (!post.tags.length) return '';
    return '<div class="postinfo"><span class="tagged">Tags: ' + post.tags.map(function (tag) {
      return '<a href="' + tagUrl(tag) + '" rel="tag">' + esc(tag) + '</a>';
    }).join(', ') + '</span></div>';
  }

  define('post-list', function (host) {
    var params = new URLSearchParams(window.location.search);
    var tag = (params.get('tag') || '').trim().toLowerCase();
    var category = (params.get('category') || '').trim().toLowerCase();
    var heading = 'Blog';
    var posts = POSTS;

    if (tag) {
      heading = "All posts tagged '" + tag + "'";
      posts = POSTS.filter(function (post) {
        return post.tags.some(function (t) { return t.toLowerCase() === tag; });
      });
    } else if (category) {
      posts = POSTS.filter(function (post) {
        return (post.category || '').toLowerCase() === category;
      });
      heading = posts.length ? posts[0].category : category;
    }

    document.title = heading + ' - Enkode';

    var html = '<h1>' + esc(heading) + '</h1>';
    if (tag || category) {
      html += '<p class="post-list-filter">Showing ' + posts.length + ' of ' + POSTS.length +
        ' posts. <a href="' + url('blog.html') + '">Show all posts</a></p>';
    }

    if (!posts.length) {
      html += '<p class="post-list-empty">No posts were found here. <a href="' + url('blog.html') + '">Browse all posts</a>.</p>';
    }

    html += posts.map(function (post) {
      return '<article class="post post-summary">' +
        '<header><h2><a href="' + postUrl(post) + '">' + esc(post.title) + '</a></h2></header>' +
        postMetaHtml(post) +
        '<section class="text"><p>' + esc(post.excerpt) + ' <a class="post-more" href="' + postUrl(post) + '">Read more</a></p></section>' +
        tagsHtml(post) +
        '</article>';
    }).join('');

    host.innerHTML = html;
  });

  /* ----------------------------- post nav ----------------------------- */

  // Posts are listed newest first, so the "next" (newer) post is the one before this one.
  define('post-nav', function (host) {
    var slug = (window.location.pathname.split('/').filter(Boolean).pop() || '').replace(/\.html?$/, '');
    var index = POSTS.findIndex(function (post) { return post.slug === slug; });
    if (index === -1) return;

    var newer = POSTS[index - 1];
    var older = POSTS[index + 1];
    var parts = [];
    if (newer) {
      parts.push('<a class="nav-next" title="Next post" href="' + postUrl(newer) + '">&lt;&lt; ' + esc(newer.title) + '</a>');
    }
    if (older) {
      parts.push('<a class="nav-prev" title="Previous post" href="' + postUrl(older) + '">' + esc(older.title) + ' &gt;&gt;</a>');
    }
    host.innerHTML = '<div id="postnavigation">' + parts.join(' | ') + '</div>';
  });

  /* --------------------------- home slider ---------------------------- */

  function initSlider(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
    if (slides.length < 2) {
      if (slides[0]) slides[0].classList.add('is-active');
      return;
    }

    var interval = parseInt(root.getAttribute('data-interval'), 10) || 7000;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var current = 0;
    var timer = null;

    var pager = document.createElement('div');
    pager.className = 'camera_pag';
    var list = document.createElement('ul');
    list.className = 'camera_pag_ul';
    pager.appendChild(list);

    var dots = slides.map(function (slide, i) {
      var dot = document.createElement('li');
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', 'Show slide ' + (i + 1) + ' of ' + slides.length);
      dot.addEventListener('click', function () { show(i); restart(); });
      dot.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          show(i);
          restart();
        }
      });
      list.appendChild(dot);
      return dot;
    });
    root.appendChild(pager);

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
        slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
        dots[i].classList.toggle('cameracurrent', i === current);
      });
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function start() {
      stop();
      if (reduceMotion) return;
      timer = window.setInterval(function () { show(current + 1); }, interval);
    }

    function restart() {
      if (timer) start();
    }

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    show(0);
    start();
  }

  /* --------------------------- back to top ---------------------------- */

  function initToTop() {
    var link = document.createElement('a');
    link.id = 'toTop';
    link.href = '#';
    link.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(link);

    link.addEventListener('click', function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function toggle() {
      link.style.display = window.scrollY > 300 ? 'block' : 'none';
    }
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.hero-slider'), initSlider);
    initToTop();
  });
})();
