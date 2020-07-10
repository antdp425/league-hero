const baseURL = "http://localhost:3000"

document.addEventListener("DOMContentLoaded",()=>{
   League.getLeagues()
})

class League{
   constructor(name, format, start, end){
      this.name = name
      this.format = format
      this.start = start
      this.end = end
   }

   static getLeagues(){
      return fetch(`${baseURL}/leagues`)
      .then (resp =>  resp.json())
      .then (leagues => League.renderLeagues(leagues))
   }

   static renderLeagues(leagues){
      leagues.forEach(el => {
         console.log(el)
         console.log(el)
      });
   }
}