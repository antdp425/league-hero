class TeamsController < ApplicationController
  before_action :set_team, only: [:show, :update, :destroy]

  # GET /teams
  def index
    teams = Team.all.order(name: :asc)

    render json: teams
  end

  # GET /teams/1
  def show
    render json: @team
    end

  # POST /teams
  def create
    team = Team.new(team_params)

    if team.save
      render json: team
    else
      render json: {errors: team.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /teams/1
  def update
    if @team.update(team_params)
      render json: @team
    else
      render json: {errors: @team.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # DELETE /teams/1
  def destroy
    @team.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_team
      @team = Team.find_by(id: params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def team_params
      params.require(:team).permit(:name, :email, :phone, :paid, :league_id)
    end
end
