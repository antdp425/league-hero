class Team < ApplicationRecord
  belongs_to :league
  validates_uniqueness_of :name, scope: [:league_id], message: "must be unique"
  validates :name, :league_id, :email, :phone, presence: :true
  validates :phone, length: {is: 10}, numericality: { only_integer: true , message: "only allows numbers" }

end
