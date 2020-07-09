class CreateTeams < ActiveRecord::Migration[6.0]
  def change
    create_table :teams do |t|
      t.string :name
      t.string :email
      t.string :phone
      t.boolean :paid
      t.references :league, null: false, foreign_key: true

      t.timestamps
    end
  end
end
