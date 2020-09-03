const baseURL = "https://league-hero-v1-api.herokuapp.com/"
const date = new Date
const today = `${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()}`
const tomorrow = `${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()+1}`
const nav = document.querySelector("nav")
const container = document.querySelector(".container-fluid")


document.addEventListener("DOMContentLoaded",()=>{
   nav.addEventListener("click", navigateTo)
   container.innerHTML = `<div>Loading...</div>`
   League.getLeagues()
})

function navigateTo(){
   switch (true) {
      case (event.target.id === "logo-nav") || (event.target.id === "leagues-nav"):
         container.innerHTML = ""
         League.getLeagues()
         break;
      case (event.target.id === "teams-nav"):
         container.innerHTML = ""
         Team.getTeams()
         break;
   }
}