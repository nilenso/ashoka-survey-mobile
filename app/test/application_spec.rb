describe AppApplication do
  it "checks that foo.com is a valid url" do
    new_app = AppApplication.new
    new_app.server_url = "http://www.foo.com"
    new_app.has_valid_url?.should be_true
  end

  it "checks that abc.xyz is an invalid url" do
    new_app = AppApplication.new
    new_app.server_url = "http://abc.xyz"
    new_app.has_valid_url?.should be_false
  end
end