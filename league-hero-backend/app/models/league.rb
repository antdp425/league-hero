class League < ApplicationRecord
   has_many :teams, dependent: :destroy
   validates :name, :league_format, :start_date, :end_date, presence: :true
end
