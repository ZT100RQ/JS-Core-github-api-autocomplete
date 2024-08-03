const searchForm = document.querySelector(".search-input");
const searchInput = document.querySelector(".search-text");
const searchAuto = document.querySelector(".search-autocom");
const searchResult = document.querySelector(".search-result");

const debounce = (fn, ms) => {
  let timer;
  function newFn() {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, ms);
  }
  return newFn;
};

function getRepo(e) {
  return fetch("https://api.github.com/search/repositories?q=" + e).then(
    (response) => response.json()
  );
}

function evenT(e) {
  getRepo(e.target.value).then((repos) => {
    let userData = e.target.value;
    let empty = [];
    if (userData) {
      empty = repos.items.slice(0, 5);
      empty = empty.map((data) => {
        return (data = "<li>" + data.name + "</li>");
      });
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
    }
    showSuggestions(empty);
  });
}

let newEvent = debounce(evenT, 300);

searchInput.addEventListener("keyup", newEvent);

function showSuggestions(list) {
  let listData;
  if (!list.length) {
    newValue = searchInput.value;
    listData = `<li>${newValue}</li>`;
  } else {
    listData = list.join("");
  }
  searchAuto.innerHTML = listData;
}

// function newLi(oneRepo) {
//   const li = document.createElement("li");
//   const p1 = document.createElement("p");
//   p1.textContent = oneRepo.name;
//   const p2 = document.createElement("p");
//   p2.textContent = oneRepo.owner.login;
//   const p3 = document.createElement("p");
//   p3.textContent = oneRepo.stargazers_count;
//   const btn = document.createElement("button");
//   btn.classList.add(`id-${oneRepo.id}`);
//   li.classList.add(`li-${oneRepo.id}`);
//   li.insertAdjacentHTML("afterbegin", btn);
//   li.insertAdjacentHTML("afterbegin", p3);
//   li.insertAdjacentHTML("afterbegin", p2);
//   li.insertAdjacentHTML("afterbegin", p1);
//   return li;
// }
