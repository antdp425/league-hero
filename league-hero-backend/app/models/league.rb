class League < ApplicationRecord
   has_many :teams, dependent: :destroy
   validates :name, :league_format, :start_date, :end_date, presence: :true
   validates :end_date_is_equal_or_after_start_date

   def end_date_is_equal_or_after_start_date
      if end_date < start_date 
         errors.add(:end_date, "must be after the start date")
      end
   end

end
