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
	
	function isWeekend() {
		var today = new Date();
		if (today.getDay() == 6 || today.getDay() == 0) {
			return true;
		} else {
			return false;
		}
	}

	function Office (name, utcOffset, regularHours) {
		var regularHours = regularHours || [9,17];
		var _self = this; 
		this.name = name; 

		this.dateObj = (function () { 
	    	var date = new Date; 
		    var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
		    return new Date(utc + (3600000 * utcOffset));
		})();

		this.hours = this.dateObj.getHours();
		this.minutes = this.dateObj.getMinutes(); 
		this.open = this.hours >=regularHours[0] && this.hours < regularHours[1]; 

		this.status = (function() {
			if (isWeekend()) {
				return 'Closed';
			} else {
				if ((this.hours >= 7 && this.hours < regularHours[0]) || (this.hours > regularHours[1] && this.hours <= 22)) {
					return 'Discretion';
				} else {
					if (this.open) {
						return 'Open';
					} else {
						return 'Closed';
					}
				}
			}
		});
		
		this.mayCall = (function() {
			if (isWeekend()) {
				return "No Way! It's the weekend!";
			} else {
				if (this.open) {
					return 'Yes';
				} else {
					if (this.hours < 7 || this.hours > 22) {
						return "No Way!";
					} else {
						return "Use Discretion";
					}
				}
			}
		});

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
		
		var GMT = 0;
		
		var EDT = GMT - 4;
		var CDT = GMT - 5;
		var PDT = GMT - 7;
		
		var EST = GMT - 5;
		var CST = GMT - 6;
		var PST = GMT - 8;
		
		var offices = [
			new Office('Dallas', CST),
			new Office('Philadelphia', EST),
			new Office('Providence', EST),
			new Office('New York', EST), 
			new Office('Wellesley', EST),
			new Office('Waltham', EST),
			new Office('Gainesville', EST),
			new Office('San Francisco', PST),
			new Office('San Jose', PST),
			new Office('Amsterdam', GMT + 2),
			new Office('Ahmedabad', GMT + 5.5, [10,19]),
			new Office('Atlanta', EST)
		].sort(function (a, b) {
			  var textA = a.name.toUpperCase();
    		  var textB = b.name.toUpperCase();
    		  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		});

		updateDisplay(offices);
		setTimeout(getTimeInfo, 10000);  
	})(); 

})(); 
