const input = document.querySelector('.input-form');
const repositoriesList = document.querySelector(".repositories-list");
const oneList = document.querySelector(".one-repository-list");
const ul = document.querySelector('ul');


let rpsRepos = [];
let oneRepos = [];

oneList.addEventListener('click', (e) => {
  let target = e.target;
  if (!target.classList.contains("img")) {
    return;
  }

  target.parentElement.parentElement.remove();
});

function repoListTemplate(repo) {
  oneRepos.push(repo.id);
  const list = document.createElement("li");
  
  list.insertAdjacentHTML('beforeend', `
        <div class="repoList">
          Name: ${repo.name}
          <br>Owner: ${repo.owner.login}
          <br>Stars: ${repo.stargazers_count}
          <button>
          <img src="pngwing.com.png" alt="img" class="img">
          </button>
          </div>`
  );

  oneList.append(list);
  input.value = "";
  renderList([]);
}

repositoriesList.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const repo = rpsRepos.find((el) => el.name === e.target.innerText);
    if (!oneRepos.includes(repo.id)) {
      repoListTemplate(repo);
    }
    clearRender();
  }
});

function clearRender() {
 repositoriesList.textContent = ''; 
}

function listTemplate({name}) {
  const list = `
    ${name}
  `;
  return list;
}

function renderList(res) {
  let fragment;

  if (ul.hasChildNodes()) {
    clearRender();
  }

  for (let i = 0; i < 5; i++) {
    if (res.items[i]) {
      fragment = document.createElement('li');
      fragment.textContent = listTemplate(res.items[i]);
      rpsRepos.push(res.items[i]);
      repositoriesList.append(fragment);
    }
  }
}

const debounce = (fn, debounceTime) => {
  let timeoutId;

  return function (value) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.call(this, value);
    }, debounceTime);
  };
};

function fn(value) {
  getUsers(value).then((data) => {
    renderList(data); 
  });
}

input.addEventListener("input", (e) => {
  const value = e.target.value;
  repos = [];
  debouncedFn(value);
});


const debouncedFn = debounce(fn, 1000);
async function getUsers(name) {
  if (name) {
    let repos = fetch(`https://api.github.com/search/repositories?q=${name}&per_page=5`).then(

      (successResponse) => {
  
        if (successResponse.status != 200) {
          return null;
        } else {
          return successResponse.json();
        }
      },
      () => {
        return null;
      }
    );
    
    return repos;
  }
}
