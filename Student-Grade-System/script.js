const btn = document.getElementById("btn");
const outputContainer = document.getElementById("output-container");
const output = document.getElementById("output");

function render(html) {
  outputContainer.classList.remove("show");
  
  setTimeout(() => {
    output.innerHTML = html;
    outputContainer.classList.add("show");
  }, 300);
}

function getGrade(score) {
  if (score >= 90) return { letter: "A+", level: "Excellent", cssClass: "good" };
  if (score >= 85) return { letter: "A",  level: "Excellent", cssClass: "good" };
  if (score >= 80) return { letter: "B+", level: "Very Good", cssClass: "good" };
  if (score >= 75) return { letter: "B",  level: "Very Good", cssClass: "good" };
  if (score >= 70) return { letter: "C+", level: "Good",      cssClass: "mid"  };
  if (score >= 65) return { letter: "C",  level: "Good",      cssClass: "mid"  };
  if (score >= 60) return { letter: "D",  level: "Pass",      cssClass: "mid"  };
  return                 { letter: "F",  level: "Fail",      cssClass: "bad"  };
}

const levelLabel = {
  "Excellent": "Excellent work! Keep it up! <i class='fa-solid fa-trophy' style='color:#fbbf24'></i>",
  "Very Good": "Great job! <i class='fa-solid fa-thumbs-up' style='color:#3b82f6'></i>",
  "Good":      "Keep pushing <i class='fa-solid fa-fire' style='color:#f97316'></i>",
  "Pass":      "Aim higher <i class='fa-solid fa-chart-line' style='color:#8b5cf6'></i>",
  "Fail":      "Study harder! <i class='fa-solid fa-book-open' style='color:#ef4444'></i>",
};

btn.addEventListener("click", () => {
  const raw = prompt("Enter student grade (0 – 100):");

  if (raw === null) return;

  const score = Number(raw.trim());

  if (raw.trim() === "" || Number.isNaN(score)) {
    render(`
      <div class="result">
        <span class="badge bad"><i class="fa-solid fa-triangle-exclamation"></i></span>
        <p class="big">Please enter a valid number</p>
        <p class="small">Only digits are accepted</p>
      </div>`);
    return;
  }

  if (score < 0 || score > 100) {
    render(`
      <div class="result">
        <span class="badge bad"><i class="fa-solid fa-ban"></i></span>
        <p class="big">Grade must be between 0 and 100</p>
        <p class="small">You entered: ${score}</p>
      </div>`);
    return;
  }

  const { letter, level, cssClass } = getGrade(score);

  render(`
    <div class="result">
      <span class="badge ${cssClass}">${letter}</span>
      <p class="big">Your grade is ${letter} &nbsp;·&nbsp; ${level}</p>
      <p class="small">Score: ${score} / 100 &nbsp;·&nbsp; ${levelLabel[level]}</p>
      <div class="score-bar-wrap">
        <div class="score-bar ${cssClass}" style="width:${score}%"></div>
      </div>
    </div>`);
});