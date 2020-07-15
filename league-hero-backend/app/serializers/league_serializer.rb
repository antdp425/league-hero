class LeagueSerializer < ActiveModel::Serializer
  attributes (League.attribute_names.map(&:to_sym))
  has_many :teams
end

# include: [:teams], 
# except: [:created_at, :updated_at]