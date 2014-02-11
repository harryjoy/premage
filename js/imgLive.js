(function($){
	jQuery.fn.extend({
		livePreview : function(options) {
			var about = {
					Version: 0.1,
					Author: "Harsh Raval",
					Created: "11 Feb 2014",
					Updated: "11 Feb 2014"
			};
			if (typeof options==="object" || !options){
				return startPreview(this, options);
			} else{
				return about;
			}
		}
	});
	var previewShapes = ['square', 'round', 'ellipse', 'square-round', 'leaf-left', 'leaf-right'];
	var startPreview = function (elem, options) {
		var defaults = { 
			width:false, /*optional element width: boolean, pixels, percentage*/
			height:false, /*optional element height: boolean, pixels, percentage*/
			default_image: '', /*optional default image*/
			image_container:{ /*preview image container element*/
				width:false, /*optional element width: boolean, pixels, percentage*/
				height:false, /*optional element height: boolean, pixels, percentage*/
				position: 'right', /*determines the position of container (left or right)*/
				shape:{
					type: 'square-round', /*optional the shape of preview image, any one from previewShapes*/
					roundness: '5px' /*optional only used when type is square-round. Determines the border radius.*/
				},
			},
			animation:{
				enabled:false, /*whether to animate or not*/
			},
			shape:{
				type: 'square-round', /*optional the shape of preview image, any one from previewShapes*/
				roundness: '5px' /*optional only used when type is square-round. Determines the border radius.*/
			},
			theme: 'default' /*optional theme to be used*/
		},
 		options = $.extend(true, defaults, options);
		var previewImageContainer = new PreviewImageContainer(options.image_container);
		var previewImage = new PreviewImage(options);
		var fileInput = $(elem);
		previewImageContainer.append(previewImage);
		fileInput.after(previewImageContainer);
		bindChangeEvent(fileInput);
		return this;
	};
	/**
	 * Preview image reference.
	 */
	PreviewImageContainer = function (options, imageShape) {
		var defaults = { /*preview image container element*/
			width:false, /*optional element width: boolean, pixels, percentage*/
			height:false, /*optional element height: boolean, pixels, percentage*/
			position: 'right', /*determines the position of container (left or right)*/
			shape:{
				type: 'square-round', /*optional the shape of preview image, any one from previewShapes*/
				roundness: '5px' /*optional only used when type is square-round. Determines the border radius.*/
			},
		};
		this.setOptions = function (previewImageContainer) {
			options = $.extend(true, defaults, options);
			if (options.position) {
				if (options.position === 'left') {
					previewImageContainer.addClass('preview-image-left');
				} else if (options.position === 'right') {
					previewImageContainer.addClass('preview-image-right');
				}
			}
			if (options.width) {
				previewImageContainer.css('width', options.width);
			}
			if (options.height) {
				previewImageContainer.css('height', options.height);
			}
			validateAndUpdateShape(previewImageContainer, options.shape, true, imageShape);
		};
		this.draw = function () {
			var previewImageContainer = $("<div></div>").addClass("preview-image-container");
			this.setOptions(previewImageContainer);
			return previewImageContainer;
		};
		return this.draw();
	};
	/**
	 * Preview image reference.
	 */
	PreviewImage = function (options) {
		var defaults = { 
			width:false, /*optional element width: boolean, pixels, percentage*/
			height:false, /*optional element height: boolean, pixels, percentage*/
			default_image: 'Awesome.png', /*optional default image*/
			image_container:{ /*preview image container element*/
				width:false, /*optional element width: boolean, pixels, percentage*/
				height:false, /*optional element height: boolean, pixels, percentage*/
				position: 'right', /*determines the position of container (left or right)*/
				shape:{
					type: 'square-round', /*optional the shape of preview image, any one from previewShapes*/
					roundness: '5px' /*optional only used when type is square-round. Determines the border radius.*/
				},
			},
			animation:{
				enabled:false, /*whether to animate or not*/
			},
			shape:{
				type: 'square-round', /*optional the shape of preview image, any one from previewShapes*/
				roundness: '5px' /*optional only used when type is square-round. Determines the border radius.*/
			},
			theme: 'default' /*optional theme to be used*/
		};
		this.setOptions = function (previewImage) {
			options = $.extend(true, defaults, options);
			if (options.width) {
				previewImage.css('width', options.width);
			}
			if (options.height) {
				previewImage.css('height', options.height);
			}
			validateAndUpdateShape(previewImage, options.shape, false);
		};
		this.draw = function () {
			var previewImage = $("<img />").addClass('preview-image').attr('src', options.default_image).attr('id', 'img-live-preview-id');
			this.setOptions(previewImage);
			return previewImage;
		};
		return this.draw();
	};
	/**
	 * Binds change event on file box.
	 */
	var bindChangeEvent = function (fileInput) {
		fileInput.on('change', function() {
			readAndPreviewImage(this);
		});
	};
	/**
	 * Validate the provide shape parameters.
	 * @param shape
	 * @returns
	 */
	var validatePreviewShape = function (shape) {
		var found = $.inArray(shape.type, previewShapes) > -1;
		if (found) {
			if (shape.type === 'square-round') {
				if (shape.roundness && shape.roundness!="") {
					return true;
				} else {
					return false;
				}
			}
			return true;
		}
		return false;
	};
	/**
	 * Function for custom exception for invalid shape.
	 * @param message
	 * @returns
	 */
	function InvalidShapeException(message) {
		this.message = message;
	}
	/**
	 * Reads and previews the selected image file.
	 * @param input
	 * @returns
	 */
	var readAndPreviewImage = function (input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$("#img-live-preview-id").attr('src', e.target.result);
			};
			reader.readAsDataURL(input.files[0]);
		}
	};
	/**
	 * Validates and updates the shape of element.
	 * @param elem
	 * @param shape
	 * @param fallback
	 * @param fallbackShape
	 */
	var validateAndUpdateShape = function (elem, shape, fallback, fallbackShape) {
		if (shape.type && shape.type !== '') {
			var valid = validatePreviewShape(shape);
			if (!valid) {
				throw new InvalidShapeException("Provided shape option is not proper.");
			}
			switch(shape.type) {
			case 'square':
				elem.addClass('preview-image-square');
				break;
			case 'round':
				elem.addClass('preview-image-round');
				break;
			case 'ellipse':
				elem.addClass('preview-image-ellipse');
				break;
			case 'square-round':
				elem.addClass('preview-image-square-round');
				elem.css('border-radius', shape.roundness);
				break;
			case 'leaf-left':
				elem.addClass('preview-image-leaf-left');
				break;
			case 'leaf-right':
				elem.addClass('preview-image-leaf-right');
				break;
			}
		} else {
			if (fallback) {
				validateAndUpdateShape(elem, fallbackShape, false);
			}
		}
	};
})(jQuery);