class LeagueSerializer < ActiveModel::Serializer
  attributes :id, :name, :league_format, :start_date, :end_date
  has_many :teams
end