class Team{
   static actionRow = document.createElement("div")
   static teamRow = document.createElement("div")
   constructor(teamInfo){
      this.id = teamInfo.id
      this.name = teamInfo.name
      this.email = teamInfo.email
      this.phone = teamInfo.phone
      this.paid = teamInfo.paid
      this.league_id = teamInfo.league_id
      this.league = teamInfo.league.name
      this.league_format = teamInfo.league.league_format
   }

   static getTeams(){
      container.innerHTML = `<div>Loading...</div>`
      fetch(`${baseURL}/teams`)
      .then (resp =>  resp.json())
      .then (teams => {
         container.innerHTML = ""
         this.setupTeamPage()
         teams.forEach(team => {
            let t = new Team(team)
            this.teamRow.innerHTML += t.renderTeamShort()
         })
         this.addListeners()
      })
   }

   static addListeners(){
      let teams = document.querySelector("#team-rows")
      teams.addEventListener("click",()=>{
         switch (true) {
            case !!(event.target.dataset.teamId) && (event.target.tagName == "A"):
               event.stopImmediatePropagation()
               let leagueId = event.target.nextElementSibling.firstElementChild.dataset.leagueId
               let teamId = event.target.dataset.teamId
               this.getTeam(leagueId, teamId)
               break;
            case !!(event.target.dataset.leagueId) && (event.target.tagName == "A"):
               event.stopImmediatePropagation()
               League.getLeague(event.target.dataset.leagueId)
               console.log("Its a league")
               break;
         }
      })
   }

   static getTeam(leagueId, teamId){
      fetch(`${baseURL}/leagues/${leagueId}/teams/${teamId}`)
      .then (resp =>  resp.json())
      .then (teams => {         
         container.innerHTML = ""
         this.setupTeamPage()
         this.actionRow.innerHTML = ""

         let t = new Team(teams)
         this.teamRow.innerHTML += t.renderTeam()
         
         this.addListeners()
         this.addActionListeners()
         
      })
   }

   static addActionListeners(){
      let actions = document.querySelector(".action-buttons")
      actions.addEventListener("click",()=>{
         let teamId = event.target.dataset.teamId
         switch (true) {
            case event.target.dataset.action === "edit":
               if (!document.querySelector("form")){    
                  event.target.parentElement.parentElement.parentElement.parentElement.parentElement.insertAdjacentHTML("beforeend",this.editTeamForm())
                  this.updateTeamListener()
               }
               break;
            case event.target.dataset.action === "delete":
               Team.deleteTeam(teamId)
               break;
         }
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
         if (!document.querySelector("form")){
            event.target.parentElement.insertAdjacentHTML("beforeend",(this.newTeamForm()))
            this.createLeagueOptions()
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
               <label for="league_id">League:</label>
               <select class="form-control" name="league_format" id="league_id" required>
                  <option value="">--Select a League--</option>
               </select>
            </div>
            <div class="form-group">
               <label for="email">Email:</label>
               <input type="email" class="form-control" name="email" id="team_email">
            </div>
            <div class="form-group">
            <label for="phone">Phone:</label>
            <input type="text" class="form-control" name="phone" id="team_phone" maxlength="10">
         </div>
            <button type="submit" class="btn btn-block btn-primary">Submit</button>
         </form>
      `
   }

   
   static createLeagueOptions(){
      const sel = document.querySelector("#league_id")
      League.all.forEach(league => sel.innerHTML += `<option value="${league.id}">${league.name}</option>`)
   }
   
   static createTeamListener(){
      let form = document.querySelector("form")
      form.addEventListener("submit", () => {
         event.preventDefault()
         this.createTeam()
         document.documentElement.scrollTop = 0;
      })
   }
   
   static createTeam(){
      let form = event.target
      let actionRow = document.querySelector("#action-row")
      
      let formData = {
         name: form[0].value,
         league_id: form[1].value,
         email: form[2].value,
         phone: form[3].value
      }
      
      let configObj = {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
         },
         body: JSON.stringify(formData)
      }
      
      fetch(`${baseURL}/teams`, configObj)
      .then(resp => resp.json())
      .then(created => {
         if (created.errors){
            this.removeAlerts()
            this.renderTeamErrors(created.errors)

         } else {
            this.removeAlerts()
            form.parentNode.removeChild(form)

            let successAlert = `
            <div class="alert alert-success text-center" role="alert">
               Team created 👍
            </div>
            `

            container.insertAdjacentHTML("afterbegin", successAlert)
            this.clearAlert("success")

            let teamRow = document.querySelector("#team-rows")
            
            let t = new Team(created)
            actionRow.innerHTML = ""
            teamRow.innerHTML = ""
            teamRow.innerHTML += t.renderTeam()

            this.addActionListeners()
      }})
   }

   static editTeamForm(){
      let teamData = {
         id: document.querySelector("[data-team-id]").dataset.teamId,
         name: document.querySelector("#team_name").innerText ,
         email: document.querySelector("#team_email").innerText ,
         phone: document.querySelector("#team_phone").innerText
      }
      return `      
         <form>
            <div class="form-group">
               <label for="team_name">Team Name:</label>
               <input type="text" class="form-control" name="team_name" id="team_name" value="${teamData.name}">
            </div>
            <div class="form-group">
               <label for="email">Email:</label>
               <input type="email" class="form-control" name="email" id="team_email" value="${teamData.email}">
            </div>
            <div class="form-group">
            <label for="phone">Phone:</label>
            <input type="text" class="form-control" name="phone" id="team_phone" maxlength="10" value="${teamData.phone}">
         </div>
            <button type="submit" class="btn btn-block btn-primary" data-team-id="${teamData.id}" id="update">Update</button>
         </form>
      `
   }

   static updateTeamListener(){
      let button = document.querySelector("#update")
      let form = button.parentElement
      form.addEventListener("submit", () => {
         event.preventDefault()
         this.updateTeam(button.dataset.teamId)
         document.documentElement.scrollTop = 0;
      })
   }

   static updateTeam(teamId){
      let form = event.target
      let formData = {
         name: form[0].value,
         email: form[1].value,
         phone: form[2].value
      }

      let configObj = {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
         },
         body: JSON.stringify(formData)
      }
      
      fetch(`${baseURL}/teams/${teamId}`, configObj)
      .then(resp => resp.json())
      .then(updated => {
         if (updated.errors) {
            this.removeAlerts()
            this.renderTeamErrors(updated.errors)
         } else {
            this.removeAlerts()
            form.parentNode.removeChild(form)


            let successAlert = `
               <div class="alert alert-success text-center" role="alert">
                  Team updated 👍
               </div>
            `

            container.insertAdjacentHTML("afterbegin", successAlert)
            this.clearAlert("success")

            let teamRow = document.querySelector("#team-rows")
            
            let t = new Team(updated)
            teamRow.innerHTML = ""
            teamRow.innerHTML += t.renderTeam()
            this.addActionListeners()
      }})
   }
   
   static deleteTeam(teamId){
      let el = document.querySelector(`[data-team-id="${teamId}"]`).parentElement.parentElement.parentElement
      let configObj = {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
         }
      }
      
      fetch(`${baseURL}/teams/${teamId}`, configObj)
      .then(()=>{
         el.remove()
         this.removeAlerts()

         let deleteAlert = `
         <div class="alert alert-danger text-center" role="alert">
            Team deleted ✅
         </div>
         `
         container.innerHTML = ""
         container.insertAdjacentHTML("afterbegin", deleteAlert)
         this.clearAlert("danger")
         this.getTeams()
      })
   }
   
   renderTeamShort(){
      return `
      <div class="col-12">
            <div class="card bg-light mb-3">
               <div class="card-header align-middle">
               <a href="#" data-team-id="${this.id}">${this.name}</a>
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
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
            <div class="card bg-light mb-3">
               <h2 class="card-header align-middle">
               <a href="#" data-team-id="${this.id}" id="team_name">${this.name}</a>
                  <span>
                     <a href="#" data-league-id="${this.league_id}" class=" badge badge-dark float-right">${this.league}</a>
                  </span>
               </h2>
                  <div class="card-body">
                  <div class="card-text"> Contact Info:</div>
                  <div class="card-text" id="team_email"><i class="fas fa-envelope"></i>${this.email}</div>
                  <div class="card-text" id="team_phone"><i class="fas fa-mobile"></i>${this.phone}</div>
                  <br>
                  <div class="action-buttons text-center">
                     <button class="btn btn-info" data-team-id="${this.id}" data-action="edit">Edit Team</button>
                     <button class="btn btn-danger" data-team-id="${this.id}" data-action="delete">Delete Team</button>
                  </div>
               </div>
            </div>
      </div>
      `
   }

   static renderTeamErrors(errors){
      let errorAlert = `
         <div class="alert alert-danger" role="alert">
            <h5 class="alert-heading">Errors occured:</h5>
         </div>
      `
      
      container.insertAdjacentHTML("afterbegin", errorAlert)

      errors.forEach(error => {
         document.querySelector(".alert").innerHTML += `
            <p class="mb-0"> - ${error}</p>
         `
      })

   }

   static clearAlert(alert){
      setTimeout(() => {document.querySelector(`.alert-${alert.toLowerCase()}`).remove()}, 5000);
   }

   static removeAlerts(){
      let alertElement = document.querySelector(".alert-danger")
      let successElement = document.querySelector(".alert-success")
      if (alertElement) alertElement.remove()
      if (successElement) successElement.remove()
   }

   static setupTeamPage(){
         this.actionRow.id = "action-row"
         this.actionRow.className = "row"
         
         this.teamRow.id = "team-rows"
         this.teamRow.classList.add("row","justify-content-center")
         this.teamRow.innerHTML = ""
         
         container.appendChild(this.actionRow)
         container.appendChild(this.teamRow)
         
         this.actionRow.innerHTML = this.newTeamButton()
         this.newTeamListener()
   }
}