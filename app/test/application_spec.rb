require 'ServerUrl/server_url'

describe AppApplication do
	
  it "checks that foo.com is a valid url" do
		new_app = AppApplication.new	
    new_app.set_server_url("http://www.foo.com")
    new_app.has_valid_url?.should be_true
  end

  it "checks that abc.xyz is an invalid url" do
		new_app = AppApplication.new	    
    new_app.set_server_url("http://abc.xyz")
    new_app.has_valid_url?.should be_false
  end

  context "when starting" do
   	it "checks if the server url is set" do
    	new_app = AppApplication.new
      new_app.set_server_url("http://google.com")
    	new_app.server_url.set?.should be_true
    end
  end
end
