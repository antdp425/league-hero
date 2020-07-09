class CreateLeagues < ActiveRecord::Migration[6.0]
  def change
    create_table :leagues do |t|
      t.string :name
      t.string :league_format
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
