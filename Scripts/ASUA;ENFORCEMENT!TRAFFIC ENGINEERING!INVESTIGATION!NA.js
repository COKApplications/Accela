// Enter your script here...
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
var v_AsgnStaff = capDetail.getAsgnStaff();

var v_reported_date = new Date();
var secs = v_reported_date.getTime();

//function secondsToTime(secs)
//{
    secs = Math.round(secs);
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };

 //   return obj;
//} 

var reportedDate  = new Date();
var reportedTime = reportedDate.getTime();
var reportedDatestr;
reportedDatestr = reportedDate;
showMessage = true;
comment ("Date=" + reportedDatestr);
comment ("Time=" + reportedTime);
// Start timer

//showMessage = true;
//var childId = getCapId;
//var alternateId = capId.getCustomID();
//comment ("Alternate Id=" + alternateId);
//var parentId = getParent();
//var parentalternateId = parentId.getCustomID();
//comment ("Parent Alternate Id=" + parentalternateId);
//var v_SR = "1";


//if (v_SR = "1") {
//var natureOfRequest = workDescGet(capId);
//    var xdetailedDescription = 
//"Transferred From Traffic Engineering" + "\r" + 
//"Source of Call " + AInfo["Source of Call"] + "\r" + 
//"311 Service Request Type " + AInfo["311 Service Request Type"] + "\r" + 
//"Detailed Work Desc "  + natureOfRequest  + "\r" + 
//"Traffic Engineering Comment " + "wfComment"; 
//var xsetDescription = updateWorkDesc(xdetailedDescription,childId);
//var xsetDescription = updateWorkDesc(natureOfRequest,childId);
//}
