 
// -- MODEL -- //

var model = {
	data: null,
	init: function() {
		$.getJSON('js/quotes.json')
		.done(function( json ) {

			model.data = json;

			// Fade in/out custom binding
			ko.bindingHandlers.fadeText = {
			    update: function(element, valueAccessor) {
			        $(element).hide();
			        ko.bindingHandlers.text.update(element, valueAccessor);
			        $(element).fadeIn(1000);
			    }        
			};

			// Contruct ViewModel after model is loaded
			var vm = new ViewModel();
			ko.applyBindings(vm);
		})
		.fail(function( jqxhr, textStatus, error ) {

			var err = textStatus + ", " + error;
			// Show error message
			console.log( "Request Failed: " + err );
			$('#quote').text(err);
			$('#author').text('something went wrong');
		});
	}
};


// -- VIEWMODEL -- //

function ViewModel(err) {

	var self = this;
	self.currentQuote = ko.observable('');
	self.currentAuthor = ko.observable('');
	
	self.nextQuote = function() {

		// Get random author
		if (!self.authorsMax) self.authorsMax = Object.keys(model.data.authors).length;
		var aRandom = Math.floor(Math.random() * self.authorsMax);
		var author = model.data.authors[aRandom].name;
		// Get random quote from author
		var quotesMax = Object.keys(model.data.quotes[aRandom]).length;
		var qRandom = Math.floor(Math.random() * quotesMax);
		var quote = model.data.quotes[aRandom][qRandom];
		// Update current quote & author
		self.currentQuote(quote);
		self.currentAuthor(author);
	};

	self.tweetQuote = function() {
		window.open('https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' +
			encodeURIComponent('"' + self.currentQuote() + '" ' + self.currentAuthor()));
    };
}


// -- Initialize Components -- //

model.init();
