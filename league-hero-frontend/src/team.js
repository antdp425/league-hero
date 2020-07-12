class Team{
   constructor(teamInfo){
      this.name = teamInfo.name
      this.email = teamInfo.email
      this.phone = teamInfo.phone
      this.paid = teamInfo.paid
      this.team_id = teamInfo.id
      this.league_id = teamInfo.league_id
      this.league = teamInfo.league.name
      this.league_format = teamInfo.league.league_format
   }

   static getTeams(){
      fetch(`${baseURL}/teams`)
      .then (resp =>  resp.json())
      .then (teams => {         
         container.innerHTML = ""
         let actionRow = document.createElement("div")
         let teamRow = document.createElement("div")

         actionRow.id = "action-row"
         actionRow.className = "row"
         
         teamRow.id = "team-rows"
         teamRow.classList.add("row","justify-content-center")
         teamRow.innerHTML = ""
         
         container.appendChild(actionRow)
         container.appendChild(teamRow)

         actionRow.innerHTML += this.newTeamButton()
         this.newTeamListener()

         teams.forEach(team => {
            let t = new Team(team)
            teamRow.innerHTML += t.renderTeamShort()
         })

         this.addListeners()

      })
   }

   static newTeamButton(){
      return `
      <button type="button" class="btn btn-block btn-outline-primary ml-auto" id="add-team">Add Team</button>
      `
   }

   static newTeamListener(){
      let button = document.querySelector("#add-team")
      button.addEventListener("click", () => {
         event.preventDefault()
         if (document.querySelector("form")){
         } else {
            event.target.parentElement.insertAdjacentHTML("beforeend",(this.newTeamForm()))
            this.createTeamListener()
         }
      })
   }

   static newTeamForm(){
      return `      
         <form>
            <div class="form-group">
               <label for="team_name">Team Name:</label>
               <input type="text" class="form-control" name="team_name" id="team_name">
            </div>
            <div class="form-group">
               <label for="email">Email:</label>
               <input type="email" class="form-control" name="email" id="team_email">
            </div>
            <div class="form-group">
            <label for="phone">Phone:</label>
            <input type="text" class="form-control" name="phone" id="team_phone" maxlength="10">
         </div>
            <button type="submit" class="btn btn-primary">Submit</button>
         </form>
      `
   }

   static createTeamListener(){
      let form = document.querySelector("form")
      form.addEventListener("submit", () => {
         event.preventDefault()
         // this.createLeague()
         form.parentNode.removeChild(form)
      })
   }


   static getTeam(leagueId, teamId){
      fetch(`${baseURL}/leagues/${leagueId}/teams/${teamId}`)
      .then (resp =>  resp.json())
      .then (teams => {         
         container.innerHTML = ""
         let actionRow = document.createElement("div")
         let teamRow = document.createElement("div")
         
         actionRow.id = "action-row"
         actionRow.className = "row"
         
         teamRow.id = "team-rows"
         teamRow.classList.add("row","justify-content-center")
         teamRow.innerHTML = ""
         
         container.appendChild(actionRow)
         container.appendChild(teamRow)
         
         let t = new Team(teams)
         teamRow.innerHTML += t.renderTeam()
         
         this.addListeners()
         
      })
   }

   static addListeners(){
      let teams = document.querySelector("#team-rows")
      teams.addEventListener("click",()=>{
         switch (true) {
            case !!event.target.dataset.teamId:               
               let leagueId = event.target.nextElementSibling.firstElementChild.dataset.leagueId
               let teamId = event.target.dataset.teamId
               Team.getTeam(leagueId, teamId)
               break;
            case !!event.target.dataset.leagueId:
               // Team.getTeams()
               console.log("Its a league")
               break;
         }
      })
   }
   
   renderTeamShort(){
      return `
      <div class="col-12">
            <div class="card bg-light mb-3">
               <div class="card-header align-middle">
               <a href="#" data-team-id="${this.team_id}">${this.name}</a>
                     <span>
                        <a href="#" data-league-id="${this.league_id}" class=" badge badge-dark float-right">${this.league}</a>
                     </span>
               </div>
            </div>
      </div>
      `
   }

   renderTeam(){
      return `
      <div class="col-10">
            <div class="card bg-light mb-3">
               <div class="card-header align-middle">
               <a href="#" data-team-id="${this.team_id}">${this.name}</a>
                     <span>
                        <a href="#" data-league-id="${this.league_id}" class=" badge badge-dark float-right">${this.league}</a>
                     </span>
               </div>
                  <div class="card-body">
                  <div class="card-text"><i class="fas fa-envelope"></i> ${this.email}</div>
                  <div class="card-text"><i class="fas fa-mobile"></i> ${this.phone}</div>
                  <br>
                  <button class="btn btn-info">Edit Team</button>
                  <button class="btn btn-danger">Delete Team</button>
               </div>
            </div>
      </div>
      `
   }
}