eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));

var childId = "0";
var checkSendEmail;
var notificationTemplate;
var vcomment = wfComment;
var appName = getAppName();
var recordType = "PERMITS/SPECIAL EVENT/APPLICATION/NA";

var capModel = aa.env.getValue("CapModel");
//var myId = capModel.getCapID();
var myId = capId;
//var projectName = capModel.getSpecialText();


if(wfTask == "Application Submittal" && wfStatus == "Application Approved") {
checkSendEmail = "YES";
notificationTemplate = "COK_PERMIT_APPLICATION_APPROVED";
}

if(wfTask == "Application Submittal" && wfStatus == "Approved Pending Payment") {
checkSendEmail = "YES";
notificationTemplate = "COK_PERMIT_APPROVED_PENDING_PAYMENT";
}

if(wfTask == "Application Submittal" && wfStatus == "Application Denied") {
checkSendEmail = "YES";
notificationTemplate = "COK_PERMIT_APPLICATION_REJECTED";
}

if(wfTask == "Create Related Permits" && wfStatus == "Create Permit") {
 v_permit_type = AInfo["Permit Type"];
 if (v_permit_type == "Parking Meter Bagging") {
 childId = createChild("Permits", "Traffic Engineering", "Parking Meter Bagging", "NA");
 AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/SIGN/NA/NA";
 assignCapToDept(AssignedToDept ,childId);
  }
}



 if(childId != "0") {
  copyOwner(capId, childId);
 // editPriority(parentPriority, childId);
  copyGisObjectsToChild(childId);
  childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
  editAppSpecific("Service Area", childserviceArea, childId);
  childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
  editAppSpecific("Council District", childCouncilDistrict, childId);
  copyAssets(cap, childId);
  var parentIntersection = AInfo["Intersection"];
  var v_workDesc = workDescGet(capId);
  v_permitdetail = v_workDesc + "\r" + vcomment;
 var v_event_name = AInfo["Event Name"];
 var v_event_location = AInfo["Event Location"];
 var v_event_start_date = AInfo["Event Start Date"];
 var v_event_end_date = AInfo["Event End Date"];
 var v_time_of_event = AInfo["Time of Event"];
 var v_presenting_organization = AInfo["Presenting Organization"];
 var v_date_time_of_setup = AInfo["Date & Time of Setup"];
 var v_date_time_of_teardown = AInfo["date_time_of_teardown"];

  var setDescription = updateWorkDesc(v_permitdetail,childId); 
  editAppSpecific("Source of Call","Special Events", childId);
  editAppSpecific("Event Name",v_event_name, childId);
  editAppSpecific("Event Location",v_event_location, childId);
  editAppSpecific("Event Start Date",v_event_start_date, childId);
  editAppSpecific("Event End Date",v_event_end_date, childId);
  editAppSpecific("Time of Event",v_time_of_event, childId);
  editAppSpecific("Presenting Organization",v_presenting_organization, childId);
  editAppSpecific("Date & Time of Setup",v_date_time_of_setup, childId);
  editAppSpecific("Date & Time Teardown",v_date_time_of_teardown, childId);
  
}


if (checkSendEmail == "YES") {
  cok_permit_send_email (notificationTemplate, recordType)
}