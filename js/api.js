const base_url = "https://api.football-data.org/";
const X_AUTH_TOKEN = "bab9853afbaf47c4a8ad7533529d65ca";
const standingFilter = "v2/competitions/2014/standings?standingType=TOTAL";
const matchFilter = "v2/competitions/2014/matches";
const teamFilter = "v2/competitions/2014/teams";

var dbPromise = idb.open("favorite-team", 1, function(db) {
    if (!db.objectStoreNames.contains("teams"))
        db.createObjectStore("teams", {
            keyPath: 'idTeam'
        });
});

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log(error);
}

var dateToDMY = date => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

function httpsFormated(url) {
    return url.replace(/^http:\/\//i, "https://");
}

function getStanding() {
    fetch(base_url + standingFilter, {
            headers: {
                "X-Auth-Token": X_AUTH_TOKEN
            }
        })
        .then(status)
        .then(json)
        .then(function(data) {
            var standingHTML = "";
            data.standings.forEach(standing => {
                    standing.table.forEach(function(result) {
                        standingHTML +=
                            `<tr>
          <td>${result.position}</td>
          <td><img class="responsive-img" width="24" height="24" src="${ result.team.crestUrl || 'img/empty_badge.svg'}"> ${result.team.name}</td>
          <td>${result.playedGames}</td>
          <td>${result.won}</td>
          <td>${result.draw}</td>
          <td>${result.lost}</td>
          <td>${result.goalsFor}</td>
          <td>${result.goalsAgainst}</td>
          <td>${result.goalDifference}</td>
          <td>${result.points}</td>
          </tr>`
                    });
                })
                // Sisipkan komponen card ke dalam elemen dengan id #content
            standingHTML += `<button id="notification-button" class="waves-effect waves-light btn"><i class="material-icons right">notifications</i>Subcribed</button>`;
            document.getElementById("standing").innerHTML = standingHTML;
        })
        .then(function() {
            enableNotificationTrigger("notification-button");
        })
        .catch(error);
}

function getMatch() {
    fetch(base_url + matchFilter, {
            headers: {
                "X-Auth-Token": X_AUTH_TOKEN
            }
        })
        .then(status)
        .then(json)
        .then(function(data) {
            var matchHTML = "";
            data.matches.forEach(match => {
                    matchHTML += `
              <div class="col s12 m12 l6">
              <div class="card">
                <div class="card-content card-match">
                <div style="text-align: center"><h6>${dateToDMY(new Date(match.utcDate))}</h6></div>
                <hr>
                  <div style="text-align: center">${match.homeTeam.name} [${match.score.fullTime.homeTeam}]</div>
                  <div style="text-align: center">VS</div>
                  <div style="text-align: center">${match.awayTeam.name} [${match.score.fullTime.awayTeam}]</div>
                </div>
              </div>
            </div>
    `
                })
                // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("match").innerHTML = matchHTML;
        })
        .catch(error);
}

function getTeam() {
    fetch(base_url + teamFilter, {
            headers: {
                "X-Auth-Token": X_AUTH_TOKEN
            }
        })
        .then(status)
        .then(json)
        .then(function(data) {
            var teamsHTML = "";
            teamsHTML += '<div class="row">'
            data.teams.forEach(team => {
                teamsHTML += `
          <div class="col s12 m6 l6">
            <div class="card">
              <div class="card-content">
                <div class="center"><img width="64" height="64" src="${team.crestUrl || 'empty_badge.svg'}"></div>
                <div class="center flow-text">${team.name}</div>
                <div class="center">${team.area.name}</div>
                <div class="center"><a href="${team.website}" target="_blank">${team.website}</a></div>
              </div>
              <div class="card-action right-align">
              <button 
              data-team-id="${team.id}"
              data-team-name="${team.name}"
              class= "saveFavorite btn-floating halfway-fab waves-effect waves-light green">
              <i class = "material-icons">star</i>
              </button>
          </div>
          </div>
          </div>
        `
            })
            teamsHTML += "</div>"
                // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("team").innerHTML = teamsHTML;
        })
        .then(function() {
            const saveFavorite = document.querySelectorAll(".saveFavorite");

            saveFavorite.forEach(function(save) {
                save.addEventListener("click", function(event) {
                    let dataDB = {
                        idTeam: this.dataset.teamId,
                        nameTeam: this.dataset.teamName

                    };
                    dbPromise.then(function(db) {
                        var tx = db.transaction("teams", "readwrite");
                        var store = tx.objectStore("teams");
                        store.add(dataDB);
                        return tx.complete;
                    });
                    M.toast({
                        html: "Saved to Favorite!",
                        displayLength: 1000,
                        outDuration: 300
                    });
                });
            });
        })
        .catch(error);
}