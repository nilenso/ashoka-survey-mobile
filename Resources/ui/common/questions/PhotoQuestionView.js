var _ = require('lib/underscore')._;
//BasicQuestionView Component Constructor
function PhotoQuestionView(question, image) {

	var self = Ti.UI.createView({
		layout : 'vertical',
		height : Titanium.UI.SIZE
	});

	var pictureButton = Ti.UI.createButton({
		title : 'Take a Picture',
		width : '48%'
	});

	var addImageView = function(image) {
		var imageView = Ti.UI.createImageView({
			width : 100,
			height : 100,
			image : image
		});
		self.add(imageView);
		self.image = image;

		var clearPictureButton = Ti.UI.createButton({
			title : 'Clear the Picture',
			width : '48%'
		});

		self.add(clearPictureButton);

		clearPictureButton.addEventListener('click', function() {
			self.image = null;
			self.remove(imageView);
			self.remove(clearPictureButton);
		})
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
	}

	self.getValue = function() {
		if (self.image) {
			filename = "image_" + (new Date()).valueOf() + ".jpg"
			var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
			file.write(self.image);
			return file.nativePath;
		}
		return null;
	};

	return self;
}

module.exports = PhotoQuestionView;
