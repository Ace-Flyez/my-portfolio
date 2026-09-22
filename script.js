const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("theme");
const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

const setTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
  }
};

// The portfolio's signature presentation is its dark studio palette. Visitors
// can still switch themes, and a previous preference always wins.
setTheme(savedTheme || "dark");

// Both the simple navbar pages and case-study header pages share this scroll
// state, so the navigation remains available with a stronger glass surface.
const pageHeaders = document.querySelectorAll(".navbar, .site-header");
const updateHeaderGlass = () => {
  const isScrolled = window.scrollY > 8;
  pageHeaders.forEach((header) => header.classList.toggle("is-scrolled", isScrolled));
};
updateHeaderGlass();
window.addEventListener("scroll", updateHeaderGlass, { passive: true });

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

// A single footer avoids visual drift between pages created at different times.
const instagramIcon = '<svg class="footer-social-icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"></circle></svg>';
const xIcon = '<svg class="footer-social-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 4l16 16M20 4 4 20"></path></svg>';

document.querySelectorAll("footer").forEach((footer) => {
  footer.classList.add("site-footer");
  footer.innerHTML = `
    <div class="container footer-inner">
      <div class="footer-brand">
        <a class="brand" href="index.html">FLYEZ<span>.</span></a>
        <p>Visual design, brand systems, campaigns, and digital experiences.</p>
      </div>
      <div class="footer-links">
        <div class="footer-link-group">
          <span class="footer-label">Explore</span>
          <a href="work.html">Work</a>
          <a href="services.html">Services</a>
          <a href="about.html">About</a>
          <a href="testimonials.html">Reviews</a>
        </div>
        <div class="footer-link-group">
          <span class="footer-label">Connect</span>
          <a href="contact.html">Start a Project</a>
          <a href="https://www.instagram.com/flyez_designs/" target="_blank" rel="noopener noreferrer">${instagramIcon}<span>Instagram</span></a>
          <a href="https://x.com/ace_flyezzz" target="_blank" rel="noopener noreferrer">${xIcon}<span>X</span></a>
        </div>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>&copy; 2026 Flyez.</p>
      <span>Built with creativity and code.</span>
    </div>`;
});

// Older pages have slightly different footer markup. Add the same inline
// icons at runtime so Instagram and X are consistent everywhere.
const socialIcons = {
  instagram: '<svg class="footer-social-icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"></circle></svg>',
  x: '<svg class="footer-social-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 4l16 16M20 4 4 20"></path></svg>',
};

document.querySelectorAll('footer a[href*="instagram"], footer a[href*="x.com"]').forEach((link) => {
  if (link.querySelector("svg")) return;
  const icon = link.href.includes("instagram") ? socialIcons.instagram : socialIcons.x;
  link.insertAdjacentHTML("afterbegin", icon);
});

const contactForm = document.querySelector(".contact-form");

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const status = contactForm.querySelector(".form-status");
  const defaultLabel = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  status.textContent = "Sending your message...";
  status.classList.remove("is-error");

  try {
    const response = await fetch(contactForm.action, {
      method: contactForm.method,
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Form submission failed");

    window.location.assign("thankyou.html");
  } catch (error) {
    status.textContent = "Your message could not be sent. Please try again or reach out through social media.";
    status.classList.add("is-error");
    submitButton.disabled = false;
    submitButton.textContent = defaultLabel;
  }
});

document.querySelectorAll(".navbar").forEach((navbar) => {
  const toggle = navbar.querySelector(".nav-toggle");
  const links = navbar.querySelector(".nav-links");

  if (!toggle || !links) return;

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    links.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    links.classList.toggle("is-open", !isOpen);
  });

  links.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
});
