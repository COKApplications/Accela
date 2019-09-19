// Enter your script here...

//make sure licensed professional license board is valid for sub type

var cap = aa.env.getValue("CapModel");
var contractor = getLicenseProf();
var licenseboard = getLicenseBoard();

var message=licenseboard;
displayMessage(message);



function getLicenseBoard(){
	var licenseboard;
	try{
		licenseboard = cap.getLicenseProf().getLicenseBoard();
	}catch(err){
		return licenseboard	}
	return licenseboard;
}
//display message in ACA - stop moving forward
function displayMessage(str){
	if(str){
		aa.env.setValue("ErrorCode", "-1");
		aa.env.setValue("ErrorMessage", str);
	}
}

