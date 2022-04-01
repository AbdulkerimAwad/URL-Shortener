(function renderTheLastThreeResults() {
  if (localStorage.getItem("lastThreeResults") !== null) {
    JSON.parse(localStorage.getItem("lastThreeResults")).forEach((result) => {
      let { originalLink, shortenedLink } = result,
        resultContainer = document.createElement("div"),
        resultsContainer = document.getElementById("results-container");
      let pattern = `
      <span class="wanted-link">${originalLink}</span>
      <a href='${shortenedLink}' class="shortened-link">${shortenedLink}</a>
      <button class='copy-shortened-link'>Copy</button>
      `;

      resultContainer.className = "result";

      resultContainer.innerHTML = pattern;

      resultsContainer.appendChild(resultContainer);
    });
  }
})();

document.getElementById("menu-btn").addEventListener("click", function () {
  this.nextElementSibling.classList.toggle("opened");
});

document.getElementById("shorten-link").addEventListener("click", function () {
  let expression =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
    api = "https://api.shrtco.de/v2/shorten?url=";

  if (this.previousElementSibling.children[0].value === "") {
    this.previousElementSibling.classList.add("warning");
  } else {
    this.previousElementSibling.classList.remove("warning");

    if (this.previousElementSibling.children[0].value.match(expression)) {
      shortenTheLink(this.previousElementSibling.children[0].value, api);
    }
  }
});

async function shortenTheLink(currentLink, apiBase) {
  const response = await fetch(`${apiBase}${currentLink}`);
  const data = await response.json();

  addResult(data.result.full_short_link, currentLink);
}

function addResult(shortenedLink, originalLink) {
  let pattern = `
    <span class="wanted-link">${originalLink}</span>
    <a href='${shortenedLink}' class="shortened-link">${shortenedLink}</a>
    <button class='copy-shortened-link'>Copy</button>
  `;

  let result = document.createElement("div");
  result.className = "result";
  result.innerHTML = pattern;

  let container = document.getElementById("results-container");

  container.insertBefore(result, container.children[0]);

  saveLastThreeResults(container);
}

function saveLastThreeResults(container) {
  let lastThreeResults = [];

  for (i = 0; i <= 2; i++) {
    let currentResult = container.children[i];

    if (currentResult !== undefined) {
      let resultInfo = {
        originalLink: currentResult.children[0].textContent,
        shortenedLink: currentResult.children[1].textContent,
      };

      lastThreeResults.push(resultInfo);
    }
  }

  localStorage.setItem("lastThreeResults", JSON.stringify(lastThreeResults));
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("copy-shortened-link")) {
    e.target.textContent = "Copied!";
    e.target.classList.add("copied");

    copyLink(e.target);
  }
});

function copyLink(btnObject) {
  navigator.clipboard.writeText(btnObject.previousElementSibling.textContent);
}
