const resemble = require('resemblejs')
const fs = require('fs');

resemble(fs.readFileSync('1.png')).compareTo(fs.readFileSync('2.png')).ignoreColors().onComplete(function (data) {
  console.log(data);
	/*
	{
	  misMatchPercentage : 100, // %
	  isSameDimensions: true, // or false
	  dimensionDifference: { width: 0, height: -1 }, // defined if dimensions are not the same
	  getImageDataUrl: function(){}
	}
	*/
});
