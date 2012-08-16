# Url identifying the server that the app syncs with

class ServerUrl
  include Rhom::PropertyBag

  attr_reader :url

  def initialize(url)
  	@url = url
  end

  def set?
  	!@url.nil?
  end
  
  def valid?
    result = Rho::AsyncHttp.get( :url => @url )
    !result["body"].empty?
  end
end