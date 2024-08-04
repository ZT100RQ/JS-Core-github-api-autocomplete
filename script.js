const searchForm = document.querySelector(".search-input");
const searchInput = document.querySelector(".search-text");
const searchAuto = document.querySelector(".search-autocom");
const searchResult = document.querySelector(".search-result");

//  DEBOUNCE

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

// Запрос на сервер.

async function getRepositories(input) {
  try {
    const responseData = await fetch(
      `https://api.github.com/search/repositories?q=${input}`
    );
    const responseRepositories = await responseData.json();
    return responseRepositories.items;
  } catch (err) {
    console.log(`Ошибка запроса: ${err}`);
  }
}

function repositoryEvent(e) {
  if (searchInput.value == 0 || searchInput.value == " ") {
    return;
  }
  getRepositories(e.target.value)
    .then((repos) => {
      let userData = e.target.value;
      let empty = [];
      if (userData) {
        empty = repos.slice(0, 5);
        empty = empty.map((data) => {
          return (data = `<li id=${empty.findIndex(
            (el) => el.name === data.name
          )}>${data.name}</li>`);
        });
        searchForm.classList.add("active");
      } else {
        searchForm.classList.remove("active");
      }
      showSuggestions(empty);
      newArr = repos.slice(0, 5);
      searchAuto.addEventListener("click", createElem);
    })
    .catch((err) => {
      alert(`Что-то пошло не так: ${err}`);
    });
}

function createElem(e) {
  myTarget = newArr[e.target.id];
  const li = document.createElement("li");
  const p1 = document.createElement("p");
  p1.textContent = `Name: ${myTarget.name}`;
  const p2 = document.createElement("p");
  p2.textContent = `Owner: ${myTarget.owner.login}`;
  const p3 = document.createElement("p");
  p3.textContent = `Stars: ${myTarget.stargazers_count}`;
  const btn = document.createElement("button");
  btn.classList.add(`delete`);
  li.classList.add(`li-${myTarget.id}`);
  li.appendChild(p1);
  li.appendChild(p2);
  li.appendChild(p3);
  li.appendChild(btn);
  searchResult.insertAdjacentElement("afterbegin", li);
  e.target.removeEventListener("click", createElem);
  searchInput.value = "";
  searchAuto.innerHTML = "";
}

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

let newEvent = debounce(repositoryEvent, 400);

searchInput.addEventListener("input", newEvent);

searchResult.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.closest("li").remove();
  }
});
