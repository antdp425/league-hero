class LeaguesController < ApplicationController
  before_action :set_league, only: [:show, :update, :destroy]

  # GET /leagues
  def index
    leagues = League.all.order(start_date: :asc)

    render json: leagues
  end

  # GET /leagues/1
  def show
    render json: @league
  end

  # POST /leagues
  def create
    @league = League.new(league_params)
    if @league.save
      render json: @league
    else
      render json: {errors: @league.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /leagues/1
  def update
    if @league.update(league_params)
      render json: @league
    else
      render json: {errors: @league.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # DELETE /leagues/1
  def destroy
    @league.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_league
      @league = League.find_by(id: params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def league_params
      params.require(:league).permit(:name, :league_format, :start_date, :end_date)
    end
end
