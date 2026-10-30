const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("theme");

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
  }
}

setTheme(savedTheme || "dark");

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

const pageHeaders = document.querySelectorAll(".navbar, .site-header");
const updateHeader = () => {
  const isScrolled = window.scrollY > 8;
  pageHeaders.forEach((header) => header.classList.toggle("is-scrolled", isScrolled));
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

document.querySelectorAll(".navbar").forEach((navHost) => {
  const toggle = navHost.querySelector(".nav-toggle");
  const links = navHost.querySelector(".nav-links");
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

const rotatingLine = document.querySelector(".hero-rotator");

if (rotatingLine) {
  const phrases = ["yours.", "bold.", "clear."];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let phraseIndex = 0;

  if (reducedMotion) {
    rotatingLine.textContent = phrases[0];
  } else {
    window.setInterval(() => {
      rotatingLine.classList.add("is-changing");
      window.setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        rotatingLine.textContent = phrases[phraseIndex];
        rotatingLine.classList.remove("is-changing");
      }, 170);
    }, 2400);
  }
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets = document.querySelectorAll("main > section");

if (!reducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((section) => {
    section.classList.add("reveal-on-scroll");
    revealObserver.observe(section);
  });
}

const contactForm = document.querySelector(".contact-form");

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    const missing = [...contactForm.querySelectorAll("[required]")]
      .filter((field) => !field.value.trim())
      .map((field) => field.labels?.[0]?.textContent || field.name);
    const status = contactForm.querySelector(".form-status");
    status.textContent = `Please complete: ${missing.join(", ")}.`;
    status.classList.add("is-error");
    contactForm.reportValidity();
    return;
  }

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const status = contactForm.querySelector(".form-status");
  const defaultLabel = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = "Sending…";
  status.textContent = "Sending your message…";
  status.classList.remove("is-error");

  try {
    const response = await fetch(contactForm.action, {
      method: contactForm.method,
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Form submission failed");
    window.location.assign("thankyou.html");
  } catch {
    status.textContent = "Your message could not be sent. Please try again or reach out through social media.";
    status.classList.add("is-error");
    submitButton.disabled = false;
    submitButton.textContent = defaultLabel;
  }
});
