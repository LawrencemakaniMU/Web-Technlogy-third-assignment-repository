/*
   My Website - script.js
   Features:
   1. Contact form validation and preview (compulsory)
   2. Theme switch (light / dark)
   3. Mobile navigation menu
   4. Study hours calculator
   5. Welcome screen (Continue button reveals the site)
   Plus a small live character counter for the message box.
 */

document.addEventListener("DOMContentLoaded", function () {
  setupWelcomeScreen();
  setupContactForm();
  setupThemeSwitch();
  setupMobileNav();
  setupHoursCalculator();
});

/* ----------------------------------------------------------
   1. CONTACT FORM: validate name, email and message, then show
   a preview on the page. Nothing is sent anywhere.
   ---------------------------------------------------------- */
function setupContactForm() {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var fields = ["name", "email", "message"];
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Each rule returns an error message, or "" when the value is fine.
  var rules = {
    name: function (value) {
      if (value.trim() === "") return "Please enter your name (spaces alone are not enough).";
      if (value.trim().length < 2) return "Your name must have at least 2 characters.";
      return "";
    },
    email: function (value) {
      if (value.trim() === "") return "Please enter your email address.";
      if (!emailPattern.test(value.trim())) return "Enter a valid email, for example name@example.com.";
      return "";
    },
    message: function (value) {
      if (value.trim() === "") return "Please write a message (spaces alone are not enough).";
      if (value.trim().length < 10) return "Your message must have at least 10 characters.";
      return "";
    }
  };

  // Checks one field and shows or clears its error message.
  function validateField(id) {
    var input = document.getElementById(id);
    var errorBox = document.getElementById(id + "-error");
    var problem = rules[id](input.value);
    errorBox.textContent = problem;
    input.classList.toggle("invalid", problem !== "");
    input.setAttribute("aria-invalid", problem !== "" ? "true" : "false");
    return problem === "";
  }

  // Live character counter under the message box.
  var message = document.getElementById("message");
  var counter = document.getElementById("message-count");
  function updateCounter() {
    counter.textContent = message.value.length + " / " + message.maxLength;
    counter.classList.toggle("near-limit", message.value.length >= message.maxLength * 0.9);
  }
  message.addEventListener("input", updateCounter);
  updateCounter();

  fields.forEach(function (id) {
    var input = document.getElementById(id);
    input.addEventListener("blur", function () { validateField(id); });
    input.addEventListener("input", function () {
      if (input.classList.contains("invalid")) validateField(id);
    });
  });

  var status = document.getElementById("form-status");
  var preview = document.getElementById("preview");

  form.addEventListener("submit", function (event) {
    event.preventDefault();           // keep everything local: no page reload
    status.textContent = "";
    preview.hidden = true;

    var firstInvalid = null;
    fields.forEach(function (id) {
      if (!validateField(id) && firstInvalid === null) {
        firstInvalid = document.getElementById(id);
      }
    });

    if (firstInvalid) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("error");
      firstInvalid.focus();
      return;
    }

    // textContent (never innerHTML) so typed text can't inject HTML.
    var topicSelect = document.getElementById("topic");
    document.getElementById("preview-name").textContent = document.getElementById("name").value.trim();
    document.getElementById("preview-email").textContent = document.getElementById("email").value.trim();
    document.getElementById("preview-topic").textContent = topicSelect.options[topicSelect.selectedIndex].text;
    document.getElementById("preview-message").textContent = message.value.trim();

    status.classList.remove("error");
    status.textContent = "Validated in your browser. No message has been sent.";
    preview.hidden = false;
  });
}

/* ----------------------------------------------------------
   2. THEME SWITCH: toggles data-theme on <html>. The CSS
   variables change, so every section follows. Saved in
   localStorage so the choice survives a reload.
   ---------------------------------------------------------- */
function setupThemeSwitch() {
  var button = document.getElementById("theme-toggle");
  if (!button) return;
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    button.textContent = theme === "dark" ? "Light mode" : "Dark mode";
    button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) { /* storage may be blocked */ }
  applyTheme(saved === "dark" ? "dark" : "light");

  button.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  });
}

/* ----------------------------------------------------------
   3. MOBILE NAVIGATION: the Menu button opens and closes the
   link list on narrow screens. aria-expanded tells screen
   readers (and the button label) whether it is open.
   ---------------------------------------------------------- */
function setupMobileNav() {
  var button = document.getElementById("nav-toggle");
  var list = document.getElementById("nav-list");
  if (!button || !list) return;

  function setOpen(open) {
    list.classList.toggle("open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
    button.innerHTML = open ? "Close &times;" : "Menu &#9776;";
  }

  button.addEventListener("click", function () {
    setOpen(!list.classList.contains("open"));
  });

  // Close the menu after choosing a link, and with the Escape key.
  list.addEventListener("click", function (event) {
    if (event.target.tagName === "A") setOpen(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && list.classList.contains("open")) {
      setOpen(false);
      button.focus();
    }
  });
}

/* ----------------------------------------------------------
   4. STUDY HOURS CALCULATOR: weekly total = hours/day x days.
   Rejects blank, non-numeric and negative hours, and days
   outside 1 to 7.
   ---------------------------------------------------------- */
function setupHoursCalculator() {
  var form = document.getElementById("hours-form");
  if (!form) return;

  var result = document.getElementById("hours-result");

  // Returns a number, or NaN when the text is blank or not a plain number.
  function parseNumber(text) {
    var trimmed = text.trim();
    if (trimmed === "" || !/^-?\d*\.?\d+$/.test(trimmed)) return NaN;
    return Number(trimmed);
  }

  function showResult(message, isError) {
    result.textContent = message;
    result.classList.toggle("error", isError);
    result.classList.toggle("ok", !isError);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var hours = parseNumber(document.getElementById("hours-per-day").value);
    var days = parseNumber(document.getElementById("days-per-week").value);

    if (isNaN(hours)) {
      showResult("Enter hours per day as a number, for example 2.5.", true);
    } else if (hours < 0) {
      showResult("Hours per day cannot be negative.", true);
    } else if (hours > 24) {
      showResult("Hours per day cannot be more than 24.", true);
    } else if (isNaN(days) || days % 1 !== 0) {
      showResult("Enter days per week as a whole number from 1 to 7.", true);
    } else if (days < 1 || days > 7) {
      showResult("Days per week must be between 1 and 7.", true);
    } else {
      var total = Math.round(hours * days * 100) / 100;
      showResult("Total: " + total + " hour" + (total === 1 ? "" : "s") + " per week.", false);
    }
  });
}

/* ----------------------------------------------------------
   5. WELCOME SCREEN: shown first. Clicking Continue fades it
   out, removes it, unlocks scrolling and moves keyboard focus
   to the main content. The page behind is hidden from keyboard
   and screen readers (inert) while the welcome screen is open.
   ---------------------------------------------------------- */
function setupWelcomeScreen() {
  var welcome = document.getElementById("welcome");
  var button = document.getElementById("welcome-continue");
  if (!welcome || !button) return;

  var pageParts = document.querySelectorAll("header, main, footer");
  pageParts.forEach(function (part) { part.inert = true; });
  button.focus();

  function closeWelcome() {
    welcome.classList.add("leaving");          // starts the fade-out
    pageParts.forEach(function (part) { part.inert = false; });
    document.body.classList.remove("welcome-open");

    // Remove it from the page once the fade has finished.
    setTimeout(function () {
      welcome.remove();
      var main = document.getElementById("main");
      if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
    }, 750);
  }

  button.addEventListener("click", closeWelcome);
}
