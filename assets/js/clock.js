function clockUpdate() {
	var date = new Date();
	document.getElementById("clock");

	function addZero(x) {
		if (x < 10) {
			return (x = "0" + x);
		} else {
			return x;
		}
	}

	function twelveHour(x) {
		x %= 12;
		return x == 0 ? 12 : x;
	}

	var weekday = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	var month = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	var d = date.getDate();
	var Y = "Zurich";
	var M = month[date.getMonth()];
	var D = weekday[date.getDay()];

	var h = addZero(twelveHour(date.getHours()));
	var m = addZero(date.getMinutes());
	var s = addZero(date.getSeconds());

	let time = Y + ", " + D + " " + M + " " + d + ", " + h + ":" + m + ":" + s;

	document.getElementById("clock").innerText = time;
	var t = setTimeout(function () {
		clockUpdate();
	}, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
	clockUpdate();
});
