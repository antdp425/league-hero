# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

4.times do 
   League.create(name: Faker::Sports::Football.competition,
       league_format: "11v11")
end

5.times do
   League.first.teams.create(name:Faker::Team.name.titleize,
       email:Faker::Internet.email,
        phone:Faker::PhoneNumber.cell_phone)
   League.second.teams.create(name:Faker::Team.name.titleize,
       email:Faker::Internet.email,
        phone:Faker::PhoneNumber.cell_phone)
   League.third.teams.create(name:Faker::Team.name.titleize,
       email:Faker::Internet.email,
        phone:Faker::PhoneNumber.cell_phone)
   League.fourth.teams.create(name:Faker::Team.name.titleize,
       email:Faker::Internet.email,
        phone:Faker::PhoneNumber.cell_phone)
   League.fifth.teams.create(name:Faker::Team.name.titleize,
       email:Faker::Internet.email,
        phone:Faker::PhoneNumber.cell_phone)
end