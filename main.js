(function () {
	'use strict';

	function getElem (elementID) {
		return document.getElementById(elementID); 
	}

	function updateDisplay (offices) {
		var timeInfo = getElem('timeInfo'); 
		var templateSource  = getElem('officeTemplate').innerHTML; 
		var template = Handlebars.compile(templateSource); 

		timeInfo.innerHTML = template({offices: offices});
	} 

	function addLeadZero (int) {
		return int < 10 ? '0' + int : int; 
	}

	function Office (name, utcOffset) {
		var _self = this; 
		this.name = name; 

		this.dateObj = (function () { 
	    	var date = new Date; 
		    var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
		    return new Date(utc + (3600000 * utcOffset));
		})();

		this.hours = this.dateObj.getHours();
		this.minutes = this.dateObj.getMinutes(); 
		this.open = this.hours >=9 && this.hours < 17; 

		this.status = this.open ? 'Open' : 'Closed'; 
		this.mayCall = this.open ? 'Yes' : 'Use Discretion';

		this.friendlyTime = (function () {
			var hours, minutes, seconds, ampm; 

			hours = this.hours; 
			if (hours == 0) { hours = 12; }
			if (hours > 12) { hours-= 12; }

			minutes = addLeadZero(this.minutes);
			seconds = addLeadZero(this.seconds); 

			ampm = this.hours >= 12 ? 'p.m.' : 'a.m.';

			return [hours, ':', minutes, ' ', ampm].join('');  
		}.bind(this))(); 
	}

	(function getTimeInfo () {
		var offices = [
			new Office('Dallas', -6),
			new Office('Wayne', -5),
			new Office('New York', -4), 
			new Office('Wellesley', -4),
			new Office('Gainesville', -4),
			new Office('San Francisco', -7),
			new Office('Amsterdam', 2),
			new Office('Ahmedabad', 5.5)
		].sort(function (a, b) {
			return a.name > b.name; 
		});

		updateDisplay(offices);
		setTimeout(getTimeInfo, 10000);  
	})(); 

})(); 
