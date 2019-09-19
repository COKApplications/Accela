/**
 * The below code is related to the AMS/Work Order/Public Service/NA record, with
 * an ApplicationSubmitAfter event. 
 */

copyParcelGisObjects();
serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
var AssignedToStaff = capDetail.getAsgnStaff(); // nlt helddesk 35028 4/20/2016

if (isEmpty(serviceArea) == true) {
   var seeworkCenter = AInfo["Work Center"];
   if (isEmpty(seeworkCenter) == false) {
     var workCenterFirst = seeworkCenter.substring(0,1);
     var myserviceArea = workCenterFirst + "00";
     editAppSpecific("Service Area", myserviceArea);
     serviceArea = myserviceArea;
}
}

if (serviceArea == "undefined") {
   var seeworkCenter = AInfo["Work Center"];
  if (isEmpty(seeworkCenter) == false) {
      var workCenterFirst = seeworkCenter.substring(0,1);
      myserviceArea = workCenterFirst + "00";
      editAppSpecific("Service Area", myserviceArea);
      serviceArea = myserviceArea;
}
}


CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);


var WorkOrderType = AInfo["Work Order Type"];
if (isEmpty(WorkOrderType))
{WorkOrderType = workDescGet(capId);
editAppSpecific("Work Order Type",WorkOrderType);
};

var workDesc = workDescGet(capId);

// Need to know how to update Work Description
//if (isEmpty(workDesc)){
//var update1 = capDetail.setworkDesc(WorkOrderType);
//} 

assignedDepartment = lookup("WO_TYPES", WorkOrderType);

if(assignedDepartment == "Service Area") { 
  if (serviceArea >= "100" && serviceArea <= "199") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC1/NA/NA/NA";
   } else if(serviceArea >= "200" && serviceArea <= "299") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC2/NA/NA/NA";
   } else if(serviceArea >= "300" && serviceArea <= "399") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC3/NA/NA/NA";
   } else if(serviceArea >= "400" && serviceArea <= "499") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC4/NA/NA/NA";
   } else if(serviceArea >= "500" && serviceArea <= "599") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC5/NA/NA/NA";
   } else if(serviceArea >= "600" && serviceArea <= "699") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC6/NA/NA/NA";
	}
    }

   foreman = lookup("COK_Public_Service_Foremen", assignedDepartment);

 //  if(foreman != "No Assignment") { // nlt helddesk 35028 4/20/2016  

 if(foreman != "No Assignment" && isEmpty(AssignedToStaff) == true ) { 
	assignCap(foreman);
    }

 logDebug("The Work Order Type is " + WorkOrderType + ".");
 logDebug("The Service Area is " + serviceArea + ".");
 logDebug("The Department is " + assignedDepartment + ".");
 logDebug("The Foreman is " + foreman + ".");



//Start Script 29 - Update Work Center
var serviceArea29;
var workCenter; 


serviceArea29 = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
if (isEmpty(serviceArea29) == false) {
switch(serviceArea29) {
	case "100":
		serviceArea29 = serviceArea29 + " AREA 1 (MISC)";
		break;
	case "200":
		serviceArea29 = serviceArea29 + " AREA 2 (MISC)";
		break;
	case "300":
		serviceArea29 = serviceArea29 + " AREA 3 (MISC)";
		break;
	case "400":
		serviceArea29 = serviceArea29 + " AREA 4 (MISC)";
		break;
	case "500":
		serviceArea29 = serviceArea29 + " AREA 5 (MISC)";
		break;
	case "600":
		serviceArea29 = serviceArea29 + " AREA 6 (MISC)";
		break;
	case "921":
		serviceArea29 = serviceArea29 + " SERV AREA OFFI";
		break;
	default:
		serviceArea29 = serviceArea29 + " SVC AREA " + serviceArea29;		
}

workCenter = lookup("WO_WORK_CENTERS", serviceArea29);
editAppSpecific("Work Center", workCenter);
}
//End Script 29

deactivateTask("Setup Work Order");
activateTask("Open");
