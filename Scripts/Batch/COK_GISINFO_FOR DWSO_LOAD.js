/*------------------------------------------------------------------------------------------------------/
| Program: COK_GISINFO_FOR DWSO_LOAD.js  Trigger: Batch
| Client:
|
| Version 1.0 - Base Version. 11/19/2015
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| BEGIN Initialize Variables
/------------------------------------------------------------------------------------------------------*/
//20190722-DBest-  Add in b1_per_id1 = 'DWS19' and rec_date 7-5-2019
var debug = "";	
var br = "<BR>";
var message =	"";
var emailText = "";
var AInfo = []; // editTaskSpecific needs this defined as global
var useAppSpecificGroupName = "";  // getAppSpecific needs this defined as global
var currentUserID = aa.env.getValue("CurrentUserID");					
var systemUserObj = aa.person.getUser(currentUserID).getOutput();

//var SetMemberArray= aa.env.getValue("SetMemberArray");

//var SetId =  aa.env.getValue("SetID");	//Un-comment me for real code
var ScriptName =  aa.env.getValue("ScriptName");
batchJobName="";
batchJobID="";
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/

SCRIPT_VERSION = 3.0

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_CUSTOM",null,true));

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode) {
		servProvCode = aa.getServiceProviderCode();

		vScriptName = vScriptName.toUpperCase();
		var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
		try {
			if (useProductScripts) {
				var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
			}	

			else {
				var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
			}
			
			return emseScript.getScriptText() + "";
		 }

			catch (err) {
			return "";
		}
	}
}


/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
sysDate = aa.date.getCurrentDate();
/*----------------------------------------------------------------------------------------------------/
|
| Start: SCRIPT PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

var showDebug = 3;	//debug level

/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

var startDate = new Date();
var startTime = startDate.getTime();			// Start timer
var systemUserObj = aa.person.getUser(currentUserID).getOutput();

//add nearest address and other GIS Info for Stormwater DWSO records
//to be run annually (manually) when DWSO records are loaded for the
//upcoming year's inspections based on random set of outfalls
//looks for status = Under Review and description = Outfall Imported

//2019-07-23 -  Make sure you are only updating where b1_per_id1 = "DWS"||yy

//showMessage = true;
var processedRecCount = 0;
var recListResult = aa.cap.getByAppType("Enforcement", "Stormwater", "Dry Weather Screening", "NA");
if (recListResult.getSuccess()) {
	myRec = recListResult.getOutput();
	//comment("Processing " + myRec.length + " records");
	logDebug("Total Records: " + myRec.length);

    for (thisRec in myRec) {
        recCap = myRec[thisRec];
        vCapId = recCap.getCapID();
        vCapIDStrAry = String(vCapId).split("-");
        vCapId = aa.cap.getCapID(vCapIDStrAry[0], vCapIDStrAry[1], vCapIDStrAry[2]).getOutput();
        capId = vCapId;
        cap = aa.cap.getCap(vCapId).getOutput();
        capId = aa.cap.getCapID(recCap.getCapID().getID1(), recCap.getCapID().getID2(), recCap.getCapID().getID3()).getOutput();
        var myCap = aa.cap.getCap(myRec[thisRec].getCapID()).getOutput();
        var myCapStatus = myCap.getCapStatus();
        

       
        var vAltId = capId.getCustomID();
		//comment(vAltId + " status: " + myCapStatus + " record created: " + cap.getFileDate().getMonth()+ '/' + cap.getFileDate().getDayOfMonth() + '/' + cap.getFileDate().getYear());
		if (myCapStatus == "Under Review") {
	
			//var v_description = workDescGet(capId);
			//comment("Processing: " + vAltId + " " + v_description);
			//if (v_description == "Outfall Imported") {
	

			var v_b1_per_id1 = b1permitGet(capId);
			var v_b1_per_id2 = b1permitGet(capId);

			comment("Processing: " + vAltId + " " + v_b1_per_id1);
			if (v_b1_per_id1 == "DWS19" and var_b1_per_id3 = "00204") {
				//comment("Found Record");

				// SW Investigation Assign Watershed based on address
				//watershed = getGISInfo("KGIS", "Watershed Basin Boundaries", "BASIN_NAME");
				//comment("BASIN_NAME: " + watershed);
				watershed = getGISInfo("KGIS", "Watershed Boundary", "BASIN_NAME");
				//comment("Watershed Boundary BASIN_NAME: " + watershed);
				editAppSpecific("Watershed", watershed);

				//Outfall Name

				OutfallName = getGISInfo("KGIS", "Outfalls", "Outfall_Name");

				editAppSpecific("Outfall", OutfallName);

				//Set description = Outfall Name
				var workDesc = workDescGet(capId);
				//if workDesc already has outfall name do not add
				//var res = workDesc.indexOf("Outfall: ")
				//comment("workDesc: " + workDesc);
				//comment("res: " + res);
				//if (res == -1) {
					var setDescription = updateWorkDesc("Outfall: " + OutfallName);
				//}

				var addNearestAddress = COK_Nearest_Address_Function_IC("Enforcement/Stormwater/Dry Weather Screening/NA~Outfalls", capId);

				//take return code from function and look up appropriate message in standard choice
				//if code = 0 (no issue) may not want to display message
				//comment(capId + " cok_error_code: " + addNearestAddress);
				var v_get_error_message = lookup("COK_Nearest_Address_Function_Errors", addNearestAddress);
				//comment(capId + " v_get_error_message: " + v_get_error_message);	

				//set addresses as not primary - then set first as primary
				addrs = aa.address.getAddressByCapId(capId).getOutput(); 
				for (thisAddr in addrs) {
					addrs[thisAddr].setPrimaryFlag("N"); 
					aa.address.editAddress(addrs[thisAddr]);
				}

				var nbrOfAddrs = addrs.length;
				if (nbrOfAddrs != 0) {
					addrs[0].setPrimaryFlag("Y"); 
					aa.address.editAddress(addrs[0]);
				}

				serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
				editAppSpecific("Service Area", serviceArea);
				CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
				editAppSpecific("Council District", CouncilDistrict);
				
				processedRecCount = processedRecCount + 1;
			}
		}
	}

	logDebug("Processed Record Count: " + processedRecCount);

}