class Team < ApplicationRecord
  belongs_to :league
  validates_uniqueness_of :name, message: "must be unique"
  validates :name, :email, :phone, presence: :true
end
