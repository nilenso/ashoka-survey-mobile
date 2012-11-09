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

	self.add(pictureButton);

	pictureButton.addEventListener('click', function() {
		Ti.Media.showCamera({
			success : function(event) {
				if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
					_(self.getChildren()).each(function(childView) {
						if (childView != pictureButton)
							self.remove(childView);
					});
					var imageView = Ti.UI.createImageView({
						width : 100,
						height : 100,
						image : event.media
					});
					self.add(imageView);
					self.image = event.media;
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
		var imageView = Ti.UI.createImageView({
			width : 100,
			height : 100,
			image : image
		});
		self.add(imageView);
		self.image = image;
	}

	self.getValue = function() {
		filename = "iamge_" + (new Date()).valueOf() + ".jpg"
		var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
		file.write(self.image);
		return file.nativePath;
	};

	return self;
}

module.exports = PhotoQuestionView;
