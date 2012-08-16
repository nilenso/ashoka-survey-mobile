require 'rho/rhocontroller'
require 'helpers/browser_helper'

class HomeController < Rho::RhoController
  include BrowserHelper

  # GET /Home
  def index
    server_url = ::Rho.get_app.server_url
      if !server_url.nil?
        render :action => index
      else
        render :action => login
      end
    render :back => '/app'
  end

  def login
  end
end
