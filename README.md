# Lawrence Makani - Personal Website (ICT251 Activity 3)

A responsive personal portfolio built with plain HTML5, CSS and JavaScript for ICT251 Web Technologies at Mulungushi University.

**Live site:** https://YOUR-SITE.onrender.com  *(replace after deploying)*

## Sections
Intro, About Me, My Hobbies, Learning Plan (with study hours calculator), Projects & Skills, My Photos, My Media (video + audio), Contact.

## JavaScript features (all in `js/script.js`)
1. **Contact form validation and preview** (compulsory) - checks name, email and message; rejects empty or spaces-only text and badly formatted emails; shows a local preview using `textContent`. Nothing is sent.
2. **Theme switch** - the header button toggles light and dark mode; the choice is remembered.
3. **Mobile navigation** - on screens 700px wide or less, a Menu button opens and closes the links.
4. **Study hours calculator** - hours per day x days per week = weekly total.

## How to test
- **Form:** submit empty; enter spaces only; use `abc@` as the email; then enter valid data and check the preview appears.
- **Theme:** click Dark mode / Light mode, reload, check the choice is kept.
- **Menu:** narrow the browser below 700px, click Menu, choose a link, press Escape to close.
- **Calculator:** try `2` and `5` (10 hours); then blank, `abc`, `-1`, `25`, and days `0`, `8`, `2.5`.

## Sources
Written by me for this course. HTML/CSS reference: W3Schools and MDN. Photos, video and audio are my own.

## Run locally
Open `index.html` with VS Code Live Server.
