var estValue = aa.env.getValue("estValue");

var message = "Electrical Work Estimated Value: " + estValue;
displayMessage(message);

//display message in ACA using error function
function displayMessage(str){
	if(str){
		aa.env.setValue("ErrorCode", "-1");
		aa.env.setValue("ErrorMessage", str);
	}
}