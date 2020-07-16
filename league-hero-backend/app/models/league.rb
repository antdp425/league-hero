class League < ApplicationRecord
   has_many :teams, dependent: :destroy
   validates :name, :league_format, :start_date, :end_date, presence: :true
   validate :end_date_is_equal_or_after_start_date

   def end_date_is_equal_or_after_start_date
      return if end_date.blank? || start_date.blank?

      if self.end_date < self.start_date 
         errors.add(:end_date, "must be after the start date")
      end
   end

end
