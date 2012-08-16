describe "ServerUrl" do
  #this test always fails, you really should have tests!

  it "checks if a url has been set" do
    server_url = ServerUrl.new("http://google.com")
    server_url.is_set?.should be_true
  end
end