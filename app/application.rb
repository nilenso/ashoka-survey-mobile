require 'rho/rhoapplication'
require 'server_url'

class AppApplication < Rho::RhoApplication

  attr_accessor :server_url

  def initialize
    # Tab items are loaded left->right, @tabs[0] is leftmost tab in the tab-bar
    # Super must be called *after* settings @tabs!
    @tabs = nil
    #To remove default toolbar uncomment next line:
    #@@toolbar = nil
    super

    # Uncomment to set sync notification callback to /app/Settings/sync_notify.
    # SyncEngine::set_objectnotify_url("/app/Settings/sync_notify")
    SyncEngine.set_notification(-1, "/app/Settings/sync_notify", '')
  end

  def set_server_url(url)
    @server_url = ServerUrl.new(url)
  end
  
  def has_valid_url?
    @server_url.valid?
  end
end
