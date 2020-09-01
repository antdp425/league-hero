Rails.application.routes.draw do
  resources :leagues do
    resources :teams
  end

  resources :teams
end
