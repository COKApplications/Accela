showMessage = true;

//editAppSpecific("Pole Size", "Medium", capId);

var checkIssuedDate = AInfo["Issued Date"];
//comment("Issued Date: " + checkIssuedDate);
if (checkIssuedDate == null) {
	var q = new Date();
	var m = q.getMonth();
	var d = q.getDate();
	var y = q.getFullYear();
	//month is 0 to 11 so add 1
	m = m + 1;
	var currentDate = m + "/" + d + "/" + y;
	//comment(currentDate);
	editAppSpecific("Issued Date", currentDate, capId);
}
