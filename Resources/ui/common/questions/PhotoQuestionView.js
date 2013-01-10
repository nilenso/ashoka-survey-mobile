var _ = require('lib/underscore')._;
var ButtonView = require('ui/common/components/ButtonView');

//BasicQuestionView Component Constructor
function PhotoQuestionView(question, image) {

	var self = Ti.UI.createView({
		layout : 'vertical',
		height : Titanium.UI.SIZE
	});

	var pictureButton = new ButtonView('Take a Picture', { 'width' : '48%' });
	var path;

	var addImageView = function(image) {
		var imageView = Ti.UI.createImageView({
			width : 100,
			height : 100,
			image : image
		});
		self.add(imageView);

		var clearPictureButton = new ButtonView('Clear the Picture', { 'width' : '48%' });

		self.add(clearPictureButton);

		clearPictureButton.addEventListener('click', function() {
			path = null;
			self.remove(imageView);
			self.remove(clearPictureButton);
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
					self.image = event.media;
					var filename = "image_" + (new Date()).valueOf() + ".jpg";
					var ImageFactory = require('ti.imagefactory');
					var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
					var new_width = 1000;
					var new_height = (self.image.height / self.image.width) * new_width;
					file.write(ImageFactory.imageAsResized(self.image, { width: new_width, height : new_height, quality: 0.7 }));
					path = file.nativePath;

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
			mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
		});
	});

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
