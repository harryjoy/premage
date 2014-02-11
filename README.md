premage
=======

jQuery library for having live preview of selected image from file browser (input[type=file]).

 * Easily configurable.
 * Provide default image to be displayed as place holder.
 * Animations while changing the image -- TODO
 * Display image in different shapes.
 * Works in all major browsers
 * Requires jQuery
 * MIT License

## Usage

```javascript
$("#imglive").livePreview({
	width:'64px',
	height:'64px',
	shape: {
		type: 'round'
	}
});
```