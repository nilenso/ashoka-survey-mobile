# Url identifying the server that the app syncs with

class ServerUrl
  include Rhom::PropertyBag

  attr_reader :url

  def initialize(url)
  	@url = url
  end

  def is_set?
  	!@url.nil?
  end

end