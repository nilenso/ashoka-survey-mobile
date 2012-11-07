//BasicQuestionView Component Constructor
function PhotoQuestionView(question, content) {

	var self = Ti.UI.createButton({
		title : 'Take a Picture',
		width : '48%'
	});

	self.addEventListener('click', function() {
		Ti.Media.showCamera({
			succes : function(event) {
				if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
					var image = event.media;
					var imageView = Ti.UI.createImageView({
						image : event.media
					});
					self.add(imageView);
				} else {
					alert("got the wrong type back =" + event.mediaType);
				}
			},
			cancel : function(event) {
				Ti.API.info("camera cancel");
			},
			error : function(event) {
				Ti.API.info("camera error");
			},
			autohide : true,
			mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
		});
	});

	return self;
}

module.exports = PhotoQuestionView;
