"use strict";

document.documentElement.classList.add("has-js");

const menu = document.querySelector(".menu-toggle");
const nav = document.getElementById("primary-nav");

function closeMenu() {
  nav.classList.remove("is-open");
  menu.setAttribute("aria-expanded", "false");
}

menu.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menu.setAttribute("aria-expanded", String(open));
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    closeMenu();
    menu.focus();
  }
});

// Show a clean fallback when an image is missing.
document.querySelectorAll("img").forEach((img) => {
  const fallback = () => {
    img.hidden = true;
    img.closest(".hero-portrait")?.classList.add("no-image");
  };

  img.addEventListener("error", fallback);

  if (img.complete && img.naturalWidth === 0) {
    fallback();
  }
});

// Highlight the current section in the navigation.
if ("IntersectionObserver" in window) {
  const links = [...nav.querySelectorAll('a[href^="#"]')];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        links.forEach((link) => {
          if (link.hash === "#" + entry.target.id) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    {
      rootMargin: "-15% 0px -60% 0px",
      threshold: 0,
    }
  );

  document.querySelectorAll("main section[id]").forEach((section) => {
    observer.observe(section);
  });
}

// Contact form.
const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const btnSpinner = document.getElementById("btnSpinner");
const formStatus = document.getElementById("formStatus");

let sending = false;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (sending) return;

  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();

  formStatus.dataset.state = "error";

  let invalid = null;

  if (!name) {
    invalid = ["name", "Please enter your name."];
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    invalid = ["email", "Please enter a valid email address."];
  } else if (!message) {
    invalid = ["message", "Please add a short message."];
  }

  if (invalid) {
    formStatus.textContent = invalid[1];
    form.elements[invalid[0]].focus();
    return;
  }

  if (!window.emailjs) {
    formStatus.textContent =
      "The contact service is unavailable. Please email rolaniog@gmail.com directly.";
    return;
  }

  sending = true;
  submitBtn.disabled = true;
  btnText.hidden = true;
  btnSpinner.hidden = false;
  formStatus.textContent = "";
  form.setAttribute("aria-busy", "true");

  try {
    window.emailjs.init("Ocol9-ye4mrd2ulbR");

    await window.emailjs.send(
      "service_3rhlchh",
      "template_faxhqvv",
      { name, email, message }
    );

    form.reset();
    formStatus.dataset.state = "success";
    formStatus.textContent = "Message sent — thanks for reaching out.";
  } catch {
    formStatus.dataset.state = "error";
    formStatus.textContent =
      "Your message could not be sent. Please try again or email rolaniog@gmail.com.";
  } finally {
    sending = false;
    submitBtn.disabled = false;
    btnText.hidden = false;
    btnSpinner.hidden = true;
    form.removeAttribute("aria-busy");
  }
});