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
	
	var clearImage = function() {
	  path = null;
    if(imageView) {
      self.remove(imageView);
      imageView = null;
    }
    if(clearPictureButton){
      self.remove(clearPictureButton);
      clearPictureButton = null;
    }
	}

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
	  var new_width = 1000;
	  var new_height = 500;
	  try {
	    file.write(ImageFactory.imageAsResized(file.read(), { width: new_width, height : new_height, quality: 0.7 }));
	  } catch(err) {
	    Ti.API.info("ERROR SAVING IMAGE " + err);
	    clearImage();
	    alert("Your phone has run out of memory.\nPlease close other running applications and try again.");
	  }
	  path = file.nativePath;
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

	return self;
}

module.exports = PhotoQuestionView;
