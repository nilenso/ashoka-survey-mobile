require 'ServerUrl/server_url'

describe "ServerUrl" do
  #this test always fails, you really should have tests!

  it "checks if a url has been set" do
    server_url = ServerUrl.new("http://google.com")
    server_url.set?.should be_true
  end

  it "checks that foo.com is a valid url" do
    server_url = ServerUrl.new("http://foo.com")
    server_url.valid?.should be_true
  end

  it "checks that abc.xyz is an invalid url" do
    server_url = ServerUrl.new("http://abc.xyz")
    server_url.valid?.should be_true
  end
end