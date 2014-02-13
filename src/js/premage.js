(function($){
	var previewShapes = ['square', 'round', 'ellipse', 'square-round', 'leaf-left', 'leaf-right'];
	var previewAnimations = ['show-hide', 'slide', 'fade', 'bounce', 'blind', 'drop', 'explode', 'fold', 'puff', 'pulsate', 'shake', 'clip'];
	var about = {
		"name": "Premage",
		"description": "jQuery plugin for having live preview of selected image from file browser (input[type=file]).",
		"keywords": ["file", "live preview", "image"],
        "version": "1.0",
        "author": {
        	"name": "Harsh Raval"
        },
        "created on": "11 Feb 2014",
        "licenses": ["MIT"],
        "homepage": "https://github.com/harryjoy/premage",
        "issues": "https://github.com/harryjoy/premage/issues",
        "wiki": "https://github.com/harryjoy/premage/wiki",
        "dependencies": ["jquery", "jquery-ui"]
	};
	jQuery.fn.extend({
		premage : function(options) {
			if (typeof options==="object" || !options) {
				var valid = validateInput(this);
				if (valid) {
					setPropertiesToElem(this);
					return startPreview(this, options);
				} else {
					return about;
				}
			} else{
				return about;
			}
		}
	});
	/**
	 * Check and set required properties to element.
	 */
	var setPropertiesToElem = function (elem) {
		var acceptProp = $(elem).attr("accept");
		if (acceptProp && acceptProp !== undefined) {
		} else {
			$(elem).attr("accept", "image/png, image/jpeg, image/jpg");
		}
	};
	/**
	 * Validate if selected element is 'input with type is equal to file'.
	 */
	var validateInput = function (elem) {
		return elem.is("input[type='file']");
	};
	var startPreview = function (elem, options) {
		var defaults = { 
			width:false,
			height:false,
			default_image: '',
			image_container:{ 
				width:false, 
				height:false, 
				position: 'right', 
				shape:{
					type: 'square-round',
					roundness: '5px'
				},
				background: 'white'
			},
			animation:{
				enabled:false,
				type: 'slide'
			},
			shape:{
				type: 'square-round',
				roundness: '5px'
			},
			theme: 'default'
		},
 		options = $.extend(true, defaults, options);
		var previewImageContainer = new PreviewImageContainer(options.image_container, options.shape, options.width, options.height);
		var previewImage = new PreviewImage(options, previewImageContainer);
		var fileInput = $(elem);
		previewImageContainer.get().append(previewImage.get());
		previewImageContainer.setAnimator(new PreviewImageAnimator(options.animation));
		fileInput.after(previewImageContainer.get());
		bindChangeEvent(fileInput, previewImage);
		return this;
	};
	/**
	 * Preview image container reference.
	 * @param options
	 * @param imageShape
	 * @param imageWidth
	 * @param imageHeight
	 */
	PreviewImageContainer = function (options, imageShape, imageWidth, imageHeight) {
		this.previewImageContainer = undefined;
		this.options = options;
		this.animator = undefined;
		this.setOptions = function () {
			if (this.options.position) {
				if (this.options.position === 'left') {
					this.previewImageContainer.addClass('preview-image-left');
				} else if (this.options.position === 'right') {
					this.previewImageContainer.addClass('preview-image-right');
				}
			}
			if (this.options.width) {
				this.previewImageContainer.css('width', this.options.width);
			}
			var currentWidth = parseFloat(this.previewImageContainer.width());
			imageWidth = parseFloat(imageWidth);
			if (currentWidth < imageWidth) {
				this.previewImageContainer.css('width', imageWidth);
			}
			if (this.options.height) {
				this.previewImageContainer.css('height', this.options.height);
			}
			var currentHeight = parseFloat(this.previewImageContainer.height());
			imageHeight = parseFloat(imageHeight);
			if (currentHeight < imageHeight) {
				this.previewImageContainer.css('height', imageHeight);
			}
			if (this.options.background) {
				this.previewImageContainer.css('background', this.options.background);
			}
			validateAndUpdateShape(this.previewImageContainer, this.options.shape, true, imageShape);
			
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
		this.getOptions = function () {
			return this.options;
		};
		this.getAnimator = function () {
			return this.animator;
		};
		this.setAnimator = function (animator) {
			this.animator = animator;
		};
		this.animate = function (animationOptions, callback) {
			if (animationOptions.enabled && this.animator) {
				this.animator.animate(this.previewImageContainer, false, callback);
			}
		};
	};
	/**
	 * Preview image reference.
	 * @param options
	 * @param animator
	 */
	PreviewImage = function (options, previewImageContainer) {
		this.previewImage = undefined;
		this.options = options;
		this.previewImageContainer = previewImageContainer;
		this.setOptions = function () {
			if (this.options.width) {
				this.previewImage.css('width', this.options.width);
			}
			if (this.options.height) {
				this.previewImage.css('height', this.options.height);
			}
			validateAndUpdateShape(this.previewImage, this.options.shape, false);
		};
		this.draw = function () {
			this.previewImage = $("<img />").addClass('preview-image').attr('src', this.options.default_image).attr('id', 'img-live-preview-id');
			this.setOptions();
		};
		this.get = function () {
			if (this.previewImage && this.previewImage !== undefined){
			} else {this.draw();}
			return this.previewImage;
		};
		this.getOptions = function () {
			return this.options;
		};
		this.update = function (source) {
			if (this.options.animation.enabled) {
				var self = this;
				this.animate(function () {
					self.previewImage.attr('src', source);
					self.animate();
				});
			} else {
				this.previewImage.attr('src', source);
			}
		};
		this.animate = function (callback) {
			if (this.options.animation.enabled) {
				this.previewImageContainer.animate(this.options.animation, callback);
			}
		};
	};
	/**
	 * Image animator reference.
	 * @param options
	 * @returns {PreviewImageAnimator}
	 */
	PreviewImageAnimator = function (options) {
		this.options = options;
		this.animate = function (elem, doTwice, callback) {
			if (!options.enabled) {
				return;
			}
			if (this.validateAnimationType()) {
				this.run(elem, callback);
				if (doTwice) this.run(elem);
			} else {
				throw new InvalidAnimationException("Animation type not valid.");
			}
		};
		this.validateAnimationType = function () {
			return $.inArray(options.type, previewAnimations) > -1;
		};
		this.run = function (elem, callback) {
			switch(options.type) {
			case 'show-hide':
				elem.toggle(callback);
				break;
			case 'slide':
				elem.slideToggle(callback);
				break;
			case 'fade':
				elem.toggle( "fade", callback );
				break;
			case 'bounce':
				elem.toggle( "bounce", { times: 3 },  callback );
				break;
			case 'blind':
				elem.toggle( "blind", callback );
				break;
			case 'drop':
				elem.toggle( "drop", callback );
				break;
			case 'explode':
				elem.toggle( "explode", callback );
				break;
			case 'fold':
				elem.toggle( "fold", callback );
				break;
			case 'puff':
				elem.toggle( "puff", callback );
				break;
			case 'pulsate':
				elem.toggle( "pulsate", callback );
				break;
			case 'shake':
				elem.toggle( "shake", callback );
				break; 
			case 'clip':
				elem.toggle( "clip", callback );
				break;
			}
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
	 * Function for custom exception for invalid animation type.
	 * @param message
	 * @returns
	 */
	function InvalidAnimationException(message) {
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
				elem.css('-webkit-border-radius', shape.roundness);
				elem.css('-moz-border-radius', shape.roundness);
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