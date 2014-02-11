(function($){
	var previewShapes = ['square', 'round', 'ellipse', 'square-round', 'leaf-left', 'leaf-right'];
	var previewAnimations = ['show-hide', 'slide', 'fade', 'bounce', 'blind', 'drop', 'explode', 'fold', 'puff', 'pulsate', 'shake'];
	jQuery.fn.extend({
		livePreview : function(options) {
			var about = {
				Version: 0.1,
				Author: "Harsh Raval",
				Created: "11 Feb 2014",
				Updated: "11 Feb 2014"
			};
			if (typeof options==="object" || !options) {
				var valid = validateInput(this);
				if (valid)
					return startPreview(this, options);
				else
					return about;
			} else{
				return about;
			}
		}
	});
	/**
	 * Validate if selected element is 'input with type is equal to file'.
	 */
	var validateInput = function (elem) {
		return elem.is("input[type='file']");
	};
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
				background: 'white'
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
		var previewImageContainer = new PreviewImageContainer(options.image_container, options.shape, options.width, options.height);
		var previewImage = new PreviewImage(options);
		var fileInput = $(elem);
		previewImageContainer.get().append(previewImage.get());
		fileInput.after(previewImageContainer.get());
		bindChangeEvent(fileInput, previewImage);
		return this;
	};
	/**
	 * Preview image reference.
	 */
	PreviewImageContainer = function (options, imageShape, imageWidth, imageHeight) {
		this.previewImageContainer = undefined;
		var defaults = { /*preview image container element*/
			width:false, /*optional element width: boolean, pixels, percentage*/
			height:false, /*optional element height: boolean, pixels, percentage*/
			position: 'right', /*determines the position of container (left or right)*/
			shape:{
				type: 'square-round', /*optional the shape of preview image, any one from previewShapes*/
				roundness: '5px' /*optional only used when type is square-round. Determines the border radius.*/
			},
		};
		this.setOptions = function () {
			options = $.extend(true, defaults, options);
			if (options.position) {
				if (options.position === 'left') {
					this.previewImageContainer.addClass('preview-image-left');
				} else if (options.position === 'right') {
					this.previewImageContainer.addClass('preview-image-right');
				}
			}
			if (options.width) {
				this.previewImageContainer.css('width', options.width);
			} else {
				var currentWidth = parseFloat(this.previewImageContainer.width());
				imageWidth = parseFloat(imageWidth);
				if (currentWidth < imageWidth) {
					this.previewImageContainer.css('width', imageWidth);
				}
			}
			if (options.height) {
				this.previewImageContainer.css('height', options.height);
			} else {
				var currentHeight = parseFloat(this.previewImageContainer.height());
				imageHeight = parseFloat(imageHeight);
				if (currentHeight < imageHeight) {
					this.previewImageContainer.css('height', imageHeight);
				}
			}
			if (options.background) {
				this.previewImageContainer.css('background', options.background);
			}
			validateAndUpdateShape(this.previewImageContainer, options.shape, true, imageShape);
			
		};
		this.draw = function () {
			this.previewImageContainer = $("<div></div>").addClass("preview-image-container");
			this.setOptions();
		};
		this.get = function () {
			if (this.previewImageContainer && this.previewImageContainer !== undefined){
			} else {this.draw();}
			return this.previewImageContainer;
		};
	};
	/**
	 * Preview image reference.
	 */
	PreviewImage = function (options, animator) {
		this.previewImage = undefined;
		this.animator = animator;
		var defaults = { 
			width:false, /*optional element width: boolean, pixels, percentage*/
			height:false, /*optional element height: boolean, pixels, percentage*/
			default_image: '', /*optional default image*/
			shape:{
				type: 'square-round', /*optional the shape of preview image, any one from previewShapes*/
				roundness: '5px' /*optional only used when type is square-round. Determines the border radius.*/
			},
			theme: 'default' /*optional theme to be used*/
		};
		this.setOptions = function () {
			options = $.extend(true, defaults, options);
			if (options.width) {
				this.previewImage.css('width', options.width);
			}
			if (options.height) {
				this.previewImage.css('height', options.height);
			}
			validateAndUpdateShape(this.previewImage, options.shape, false);
		};
		this.draw = function () {
			this.previewImage = $("<img />").addClass('preview-image').attr('src', options.default_image).attr('id', 'img-live-preview-id');
			this.setOptions(this.previewImage);
		};
		this.get = function () {
			if (this.previewImage && this.previewImage !== undefined){
			} else {this.draw();}
			return this.previewImage;
		};
		this.update = function (source) {
			this.previewImage.attr('src', source);
		};
	};
	PreviewImageAnimator = function (options) {
		var defaults = {
			enabled:false, /*whether to animate or not*/
		};
		this.setOptions = function (previewImage) {
			options = $.extend(true, defaults, options);
		};
	};
	/**
	 * Binds change event on file box.
	 */
	var bindChangeEvent = function (fileInput, previewImage) {
		fileInput.on('change', function() {
			readAndPreviewImage(this, previewImage);
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
	var readAndPreviewImage = function (input, previewImage) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				previewImage.update(e.target.result);
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