//get value from field and update another field

var cap = aa.env.getValue("CapModel");

//var BUPermit =  aa.env.getAppSpecific("Building Permit#"); -- error
//var BUPermit = aa.env.getInputValue("Building Permit#"); -- error
//var BUPermit = aa.env.getValue("Location"); -- no error but no value
//var BUPermit = getAppSpecific("Location"); -- error

//var message = "Building Permit = ";

var BUPermit = getAppSpecific("Building Permit#", cap);

var message = "Building Permit = " + BUPermit;

displayMessage(message);

//display message in ACA
function displayMessage(str){
	if(str){
		aa.env.setValue("ErrorCode", "-1");
		aa.env.setValue("ErrorMessage", str);
	}
}

function getAppSpecific(itemName, itemCap)  // optional: itemCap
{
    var useAppSpecificGroupName = false;
    if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

    if (useAppSpecificGroupName)
    {
        if (itemName.indexOf(".") < 0)
            { logDebug("**WARNING: editAppSpecific requires group name prefix when useAppSpecificGroupName is true") ; return false }
        
        
        var itemGroup = itemName.substr(0,itemName.indexOf("."));
        var itemName = itemName.substr(itemName.indexOf(".")+1);
    }

//    var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);

    var returnstring = "Hello " + itemCap;
    return returnstring;

}