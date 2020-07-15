class TeamSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :phone, :league_id
  belongs_to :league
end
