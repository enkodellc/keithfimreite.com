# Enkode / keithfimreite.com — static site

A plain HTML, CSS and JavaScript copy of [keithfimreite.com](https://keithfimreite.com/), rebuilt from the
BlogEngine.NET version so it can be hosted on any static file host. There is no build step, no server-side
code and no framework: upload the files as they are.

## Run it locally

Serve the folder with any static file server, for example:

```bash
python3 -m http.server 8347
```

Then open <http://localhost:8347/>. Opening `index.html` straight from disk also works, apart from the
custom 404 page.

## Deploy

Upload the whole folder to the web root of the host (GitHub Pages, Netlify, Cloudflare Pages, S3, IIS,
nginx, shared hosting, and so on). Notes:

- `404.html` uses root-absolute paths (`/assets/...`) so it works for any missing address. Point the host's
  "not found" page at it. Every other page uses relative paths and also works from a sub-folder.
- `sitemap.xml` and `robots.txt` assume the site lives at `https://keithfimreite.com/`.
- The old addresses ended in `.aspx` (for example `/page/logo-designs.aspx`). They are not redirected by
  these files; see "Old addresses" below if you want to keep them working.

## Layout

```
index.html                     Home
enkode-portfolio.html          Portfolio
web-application-services.html  Services
logo-designs.html              Logo designs
software-engineer-resume.html  Resume
aspnet-saas-web-application-development.html
responsive-design.html
contact.html                   Contact page (points visitors to LinkedIn)
blog.html                      Post list; also handles ?tag=... and ?category=...
angular-multi-slider-directive.html   Live demo page for the slider post
privacy-policy.html
404.html
post/                          One file per blog post
assets/
  css/        bootstrap.css, theme.css (original theme), font-awesome.css, site.css (additions)
  js/         site.js (header, footer, menu, slider, post list), posts.js (post index)
  img/        Theme images and icons
  uploads/    Content images (portfolio screenshots, logos, photos)
  fonts/      Font Awesome and Glyphicons
  calculator/ ROI / loan calculator scripts and styles
  multislider/ AngularJS multi slider demo
```

## Common edits

- **Menu, address, social links**: the `SITE` object at the top of `assets/js/site.js`.
  The header and footer of every page are drawn from it.
- **Add a post**: copy a file in `post/`, change its content, then add an entry at the top of
  `assets/js/posts.js`. That list feeds the blog page, the footer's "Recent Posts" and the
  newer/older links under each post.
- **Add a page**: copy an existing page and add it to `SITE.menu` if it belongs in the menu.

## What changed compared with the BlogEngine.NET site

- Comments, ratings, search, the RSS feed and the admin area needed the server and are gone. The RSS icon
  in the header now opens the blog page.
- The old Google Analytics (Universal Analytics) snippet was removed; that service has been shut down.
- jQuery and its plugins were replaced by a small amount of plain JavaScript.
- The contact form needed the server and is gone. The contact page now sends visitors to the Enkode
  LinkedIn page instead. The phone number and e-mail address were taken off the whole site.
- The multi slider demo loads its scripts from this site. On the old site they were requested over
  `http://` and blocked by browsers.

### ROI calculator licence check

`assets/calculator/enkode.js` is D3 3.4.13 with a licence check in front that only lets it run on
`keithfimreite.com` and its sub-domains; on any other host it stops the page from loading.
`post/roi-investment-calculator.html` therefore only requests that file on `keithfimreite.com`, and shows
a short notice instead of the calculator everywhere else (local preview included).
`assets/calculator/biScript.js` is the same D3 build without the check and is what the loan calculator
post uses.

### Links removed or changed

Sites that no longer exist keep their text or screenshot but are no longer links.

| Where | Link | What happened |
| --- | --- | --- |
| Portfolio | widowindustries.com, marquedental.com, stellarcateringaz.com, myskillmap.com | Domain gone; link removed |
| Portfolio | adventuresonly.com, housingangels.com, nationalrentalpros.com, qhost.com | No response; link removed |
| Portfolio | realcorerealty.com | Domain is for sale; link removed |
| Portfolio, rental software post | sunsetfarmcabins.com | Now an unrelated placeholder site; link removed |
| Rental software post | realcorerealty.com, nationalrentalpros.com | Link removed |
| Dan Rust testimonial | myskillmap.com | Link removed |
| ROI calculator post | brickhousecapital.com equipment lease calculator | No response; link removed |
| ROI calculator post | cryobuilt.com/financing | Link was malformed; fixed |
| Blazor post | blazorboilerplate.com | No response; now points to the GitHub repository |
| Services | `Realtor.aspx`, `Entech-ASP-Net.aspx`, `ISILink-ASP-Net.aspx`, `WebApplications.aspx` | Pages did not exist; links removed |
| Services | `Logo.aspx` | Now points to the logo designs page |
| Services | cybertrails.com | No response; link removed |
| Services | Authorize.net sign-up button image | Image no longer exists; replaced by a text link |
| ROI calculator post | `enkode-white.png` logo | Image was missing; uses the Enkode logo instead |

`tcorcalc.com` is still linked but could not be confirmed: it answers automated checks with a bot
challenge.

### Old addresses

| Old | New |
| --- | --- |
| `/` and `/default.aspx` | `/index.html` |
| `/page/<name>.aspx` | `/<name>.html` |
| `/post/<name>.aspx` | `/post/<name>.html` |
| `/contact.aspx` | `/contact.html` |
| `/angular-multi-slider-directive.aspx` | `/angular-multi-slider-directive.html` |
| `/blog.aspx`, `/archive.aspx`, `/author/keith.aspx` | `/blog.html` |
| `/?tag=/<tag>` | `/blog.html?tag=<tag>` |
| `/category/<name>.aspx` | `/blog.html?category=<name>` |

### Not carried over

The old sitemap listed 15 pages that no page on the site linked to (for example `art-construction`,
`website-templates`, `what-are-meta-tags`). They are not part of this copy.
