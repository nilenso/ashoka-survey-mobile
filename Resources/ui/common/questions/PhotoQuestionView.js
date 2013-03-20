var _ = require('lib/underscore')._;
var ButtonView = require('ui/common/components/ButtonView');

//BasicQuestionView Component Constructor
function PhotoQuestionView(question, image) {

  var self = Ti.UI.createView({
    layout : 'vertical',
    height : Titanium.UI.SIZE
  });

  var pictureButton = new ButtonView('Take a Picture', { 'width' : '48%' });
  var path, imageView, clearPictureButton;

  var deleteImage = function() {
    if (path) {
      var imageFile = Ti.Filesystem.getFile(path);
      imageFile.deleteFile();
      path = null;
    }
  };

  var clearImage = function() {
    if(imageView) {
      self.remove(imageView);
      imageView = null;
    }
    deleteImage();    
    if(clearPictureButton){
      self.remove(clearPictureButton);
      clearPictureButton = null;
    }
  };

  var addImageView = function(image) {
    imageView = Ti.UI.createImageView({
      width : 100,
      height : 100,
      image : image
    });
    self.add(imageView);

    clearPictureButton = new ButtonView('Clear the Picture', { 'width' : '48%' });

    self.add(clearPictureButton);

    clearPictureButton.addEventListener('click', function() {
      clearImage();
    });
  };

  self.add(pictureButton);

  pictureButton.addEventListener('click', function() {
    Ti.Media.showCamera({
      success : function(event) {
        if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
          _(self.getChildren()).each(function(childView) {
            if (childView != pictureButton)
              self.remove(childView);
          });
          addImageView(event.media);
          var filename = "image_" + (new Date()).valueOf() + ".jpg";
          var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
          file.write(event.media);
          event.media = null;
          path = file.nativePath;
          resize(file);

        } else {
          alert("got the wrong type back :" + event.mediaType);
        }
      },
      cancel : function(event) {
      },
      error : function(event) {
        Ti.API.info("camera error");
      },
      autohide : true,
      mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
      allowEditing: true
    });
  });

  var resize = function(file) {
    var ImageFactory = require('ti.imagefactory');
    var image = file.read();
    var new_width = 1000;
    if (image.width < new_width) {
      file = null;
      image = null;
      return;
    }
    var new_height = (image.height / image.width) * new_width;
    try {      
      var image_module = require('org.selfkleptomaniac.ti.imageasresized');
      image = image_module.cameraImageAsResized(image, new_width, new_height, 0);
      file.write(ImageFactory.compress(image, 0.6));
    } catch(err) {
      alert(L("out_of_memory"));
      Ti.API.info("ERROR SAVING IMAGE " + err);
      clearImage();
    }
    file = null;
    image = null;
    image_module = null;
  };

  if (image) {
    var imageFile = Ti.Filesystem.getFile(image);
    addImageView(imageFile.read());
    path = imageFile.nativePath;
  }

  self.getValue = function() {
    if (path) {
      Ti.API.info("Photo for photo question is " + path);
      return path;
    }
    return null;
  };

  self.getSubQuestions = function() {
    return null;
  }
  return self;
}

module.exports = PhotoQuestionView;
