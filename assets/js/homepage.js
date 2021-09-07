var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

//Evaluates the typed user name
var formsubmitHandler = function (event) {
  event.preventDefault();
  console.log(event);

  //get value from input element
  var username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);

    // clear old content
    repoContainerEl.textContent = "";
    nameInputEl.value = "";
  } else {
    alert("Please enter a Github username");
  }
};

//Fetches repo info based on user name
var getUserRepos = function (user) {
  //format the github api url
  var apiUrl = "http://api.github.com/users/" + user + "/repos";

  // make a get request to url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayRepos(data, user);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert("Unable to connect to GitHub");
    });
};

//Display repos function
var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }

  console.log(repos);
  console.log(searchTerm);

  //clear old content
  repoSearchTerm.textContent = searchTerm;

  //loop over repos
  for (var i = 0; i < repos.length; i++) {
    //format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name; //converts the name from the repo to the variable

    // create a container for each repo
    var repoEl = document.createElement("div");
    repoEl.classList = "list-item flex-row justify-space-between align-center";

    //create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName; //assigns repoName (created above) to titleEl

    //append to container
    repoEl.appendChild(titleEl);

    //create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    //check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issues(s)";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }
    //append to container
    repoEl.appendChild(statusEl);

    //append contrainer to the dom
    repoContainerEl.appendChild(repoEl);
  }
};

userFormEl.addEventListener("submit", formsubmitHandler);
