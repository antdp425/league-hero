class TeamSerializer < ActiveModel::Serializer
  attributes (Team.attribute_names.map(&:to_sym))
  belongs_to :league
end
