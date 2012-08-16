require 'rho/rhocontroller'
require 'helpers/browser_helper'

class ServerUrlController < Rho::RhoController
  include BrowserHelper

  # GET /ServerUrl
  def index
    @server_urls = ServerUrl.find(:all)
    render :back => '/app'
  end

  # GET /ServerUrl/{1}
  def show
    @server_url = ServerUrl.find(@params['id'])
    if @server_url
      render :action => :show, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # GET /ServerUrl/new
  def new
    @server_url = ServerUrl.new
    render :action => :new, :back => url_for(:action => :index)
  end

  # GET /ServerUrl/{1}/edit
  def edit
    @server_url = ServerUrl.find(@params['id'])
    if @server_url
      render :action => :edit, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # POST /ServerUrl/create
  def create
    @server_url = ServerUrl.create(@params['server_url'])
    redirect :action => :index
  end

  # POST /ServerUrl/{1}/update
  def update
    @server_url = ServerUrl.find(@params['id'])
    @server_url.update_attributes(@params['server_url']) if @server_url
    redirect :action => :index
  end

  # POST /ServerUrl/{1}/delete
  def delete
    @server_url = ServerUrl.find(@params['id'])
    @server_url.destroy if @server_url
    redirect :action => :index  
  end
end
