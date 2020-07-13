class League < ApplicationRecord
   has_many :teams, dependent: :destroy
end
