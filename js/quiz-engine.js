// quiz-engine.js — list rendering, quiz flow, and pin persistence (localStorage).

const PIN_STORE_KEY = "vfh_earned_pins";

function getEarnedPins() {
  try {
    return JSON.parse(localStorage.getItem(PIN_STORE_KEY)) || [];
  } catch {
    return [];
  }
}

function markPinEarned(quizId) {
  const earned = getEarnedPins();
  if (!earned.includes(quizId)) {
    earned.push(quizId);
    localStorage.setItem(PIN_STORE_KEY, JSON.stringify(earned));
  }
}

function pinBadgeHTML(quiz, earned, linkToChallenges = false) {
  const icon = quiz.pinImage
    ? `<img src="${quiz.pinImage}" alt="${quiz.pinName}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
    : quiz.pinIcon;

  const inner = `
    <div class="pin-badge ${earned ? 'earned' : 'locked'}">${earned ? icon : "?"}</div>
    <div class="pin-name">${earned ? quiz.pinName : "Locked"}</div>
  `;

  const tag = linkToChallenges ? "a" : "div";
  const href = linkToChallenges ? `href="challenges.html"` : "";

  return `
    <${tag} class="pin ${earned ? '' : 'locked'}" ${href} style="--tilt:${(Math.random() * 10 - 5).toFixed(1)}deg;">
      ${inner}
    </${tag}>
  `;
}

// ---------- Home page pin strip ----------
function renderPinStrip(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const earned = getEarnedPins();

  if (QUIZZES.length === 0) {
    target.innerHTML = `<p class="state-msg">No challenges yet — check back soon.</p>`;
    return;
  }

  target.innerHTML = QUIZZES.map(q => pinBadgeHTML(q, earned.includes(q.id), true)).join("");
}

// ---------- Challenges list page ----------
function renderQuizList(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const earned = getEarnedPins();

  if (QUIZZES.length === 0) {
    target.innerHTML = `<p class="state-msg">No trip quizzes published yet.</p>`;
    return;
  }

  target.innerHTML = QUIZZES.map(q => {
    const isEarned = earned.includes(q.id);
    const icon = q.pinImage
      ? `<img src="${q.pinImage}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
      : q.pinIcon;

    let excerptText;
    if (q.comingSoon) {
      excerptText = "Quiz launching soon \u2014 tap for a preview.";
    } else if (isEarned) {
      excerptText = `Pin earned: ${q.pinName}`;
    } else {
      excerptText = `${q.questions.length} questions \u2014 unlock the ${q.pinName}`;
    }

    return `
      <a class="card" href="quiz.html?id=${encodeURIComponent(q.id)}">
        <div style="display:flex; align-items:center; gap:1.1rem;">
          <div class="pin" style="--tilt:-3deg;">
            <div class="pin-badge ${isEarned ? 'earned' : 'locked'}">${isEarned ? icon : "?"}</div>
          </div>
          <div>
            <div class="card-title">
              ${q.title}
              ${q.comingSoon ? '<span class="tag" style="margin-left:0.4rem;">coming soon</span>' : ''}
            </div>
            <div class="card-meta">${q.location}</div>
            <p class="card-excerpt">${excerptText}</p>
          </div>
        </div>
      </a>
    `;
  }).join("");
}

// ---------- Individual quiz runner ----------
function getQuizIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderQuizRunner(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const quizId = getQuizIdFromURL();
  const quiz = QUIZZES.find(q => q.id === quizId);

  if (!quiz) {
    target.innerHTML = `
      <div class="quiz-card">
        <p class="state-msg">Couldn't find that quiz. <a href="challenges.html" style="color:var(--clay);">Back to Challenges \u2192</a></p>
      </div>
    `;
    return;
  }

  // Teaser branch — shows a "coming soon" page instead of the quiz.
  if (quiz.comingSoon) {
    target.innerHTML = `
      <div class="quiz-card" style="text-align:center;">
        <div class="pin-badge locked" style="margin: 0 auto 1.25rem; width:96px; height:96px; font-size:2.4rem;">${quiz.pinIcon}</div>
        <div class="quiz-progress" style="justify-content:center;">${quiz.title}</div>
        <h3 style="font-family:var(--display); font-size:1.4rem; margin:0.5rem 0 1rem;">Coming soon</h3>
        <p style="color:var(--ink-soft); max-width:48ch; margin:0 auto 1.5rem;">${quiz.location}</p>
        <a class="btn ghost" href="challenges.html">Back to Challenges</a>
      </div>
    `;
    return;
  }

  let current = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    const q = quiz.questions[current];
    target.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-progress">Question ${current + 1} of ${quiz.questions.length} \u2014 ${quiz.title}</div>
        <div class="quiz-question">${q.q}</div>
        <div class="quiz-options" id="optionsWrap">
          ${q.options.map((opt, i) => `<button class="quiz-option" data-i="${i}">${opt}</button>`).join("")}
        </div>
      </div>
    `;

    const buttons = target.querySelectorAll(".quiz-option");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const chosen = parseInt(btn.dataset.i, 10);
        const correct = q.correct;

        buttons.forEach(b => {
          const bi = parseInt(b.dataset.i, 10);
          b.disabled = true;
          if (bi === correct) b.classList.add("correct");
          else if (bi === chosen) b.classList.add("incorrect");
        });

        if (chosen === correct) score++;

        setTimeout(() => {
          answered = false;
          current++;
          if (current < quiz.questions.length) {
            renderQuestion();
          } else {
            renderResult();
          }
        }, 900);
      });
    });
  }

  function renderResult() {
    const passed = score >= Math.ceil(quiz.questions.length * 0.5);
    if (passed) markPinEarned(quiz.id);

    const icon = quiz.pinImage
      ? `<img src="${quiz.pinImage}" alt="${quiz.pinName}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
      : quiz.pinIcon;

    target.innerHTML = `
      <div class="quiz-card quiz-result">
        <div class="quiz-progress">Score: ${score} / ${quiz.questions.length}</div>
        <div class="pin-badge ${passed ? 'earned' : 'locked'}" style="margin: 0 auto;">${passed ? icon : "?"}</div>
        <h3>${passed ? `You earned the ${quiz.pinName}!` : "Not quite \u2014 try again"}</h3>
        <p style="color:var(--ink-soft); max-width:42ch; margin: 0 auto 1.5rem;">
          ${passed
            ? `Added to your collection from ${quiz.location}.`
            : `You need at least ${Math.ceil(quiz.questions.length * 0.5)} correct to unlock this pin.`}
        </p>
        <div style="display:flex; gap:0.75rem; justify-content:center;">
          <button class="btn ghost" id="retryBtn">Try again</button>
          <a class="btn" href="challenges.html">Back to Challenges</a>
        </div>
      </div>
    `;

    document.getElementById("retryBtn").addEventListener("click", () => {
      current = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}