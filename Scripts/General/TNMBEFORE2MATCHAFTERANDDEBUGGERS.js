/*------------------------------------------------------------------------------------------------------/
| Program : InspectionMultipleScheduleBefore3.0.js
| Event   : InspectionMultipleScheduleBefore
|
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
|
| Client  : N/A
| Action# : N/A
|
| Notes   :
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var controlString = "InspectionScheduleBefore"; // Standard choice for control
var preExecute = "PreExecuteForAfterEvents"; // Standard choice to execute first (for globals, etc)
var documentOnly = false; // Document Only -- displays hierarchy of std choice steps

/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0;
showDebug=true;
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
aa.print("bzr: " + bzr);
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
                useSA = true;
                SA = bzr.getOutput().getDescription();
                bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
                if (bzr.getSuccess()) {
                                SAScript = bzr.getOutput().getDescription();
                }
}
aa.print("SA: " + SA);
if (SA) {
                eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
                eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA));
                eval(getScriptText(SAScript, SA));
} else {
                eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS_ASB"));
                eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
                eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
}

eval(getScriptText("INCLUDES_CUSTOM"));

if (documentOnly) {
                doStandardChoiceActions(controlString, false, 0);
                aa.env.setValue("ScriptReturnCode", "0");
                aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
                aa.abortScript();
}

var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";
var doStdChoices = true; // compatibility default
var doScripts = false;
var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
if (bzr) {
                                                aa.print("in the IF: " + bzr);
                var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE");
                                                aa.print("bvr1:" + bvr1);
                doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
                                                aa.print("standardChoice:" + bvr1.getOutput().getAuditStatus());
                var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT");
                doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
                                                aa.print("doScript:" + bvr1.getOutput().getAuditStatus());                                              
}

function getScriptText(vScriptName) {
                var servProvCode = aa.getServiceProviderCode();
                if (arguments.length > 1) {
                                servProvCode = arguments[1]; // use different serv prov code
                }
                vScriptName = vScriptName.toUpperCase();
                var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
                try {
                                var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
                                return emseScript.getScriptText() + "";
                } catch (err) {
                                return "";
             }
}

function logDebug(dstr) {
            debug += dstr + br; 
}
/*------------------------------------------------------------------------------------------------------/
| BEGIN Event Specific Variables
/------------------------------------------------------------------------------------------------------*/

//
// load up an array of result objects
//

schedObjArray = new Array();

var s_id1 = aa.env.getValue("PermitID1Array");
var s_id2 = aa.env.getValue("PermitID2Array");
var s_id3 = aa.env.getValue("PermitID3Array");
var inspIdArr = aa.env.getValue("InspectionIDArray");
var inspInspArr = aa.env.getValue("InspectionInspectorArray");
var inspAMPMArray = aa.env.getValue("InspectionAMPMArray");
var inspEndAMPMArray = aa.env.getValue("InspectionEndAMPMArray");
var inspDateArray = aa.env.getValue("InspectionDateArray");
var inspEndTimeArray  = aa.env.getValue("InspectionEndTimeArray");
var inspTimeArray = aa.env.getValue("InspectionTimeArray");
var parentInspIDArray = aa.env.getValue("ParentInspectionIDArray");
var inspInspArr = aa.env.getValue("InspectionInspectorArray");

var resultCapIdStringSave = null;

for (thisElement in s_id1) {
                var r = new schedObj();
                var s_capResult = aa.cap.getCapID(s_id1[thisElement], s_id2[thisElement], s_id3[thisElement]);
                if (s_capResult.getSuccess())
                                r.capId = s_capResult.getOutput();
                else
                                aa.print("**ERROR: Failed to get capId: " + s_capResult.getErrorMessage());
                r.capIdString = r.capId.getCustomID();
                r.inspId = inspIdArr[thisElement];
                r.inspector = inspInspArr[thisElement];
                r.time = inspTimeArray[thisElement];
                r.date = inspDateArray[thisElement];
                r.AMPM = inspAMPMArray[thisElement];
                r.parent = parentInspIDArray[thisElement];
                r.inspObj = aa.inspection.getInspection(r.capId,r.inspId).getOutput();
                schedObjArray.push(r);
}

schedObjArray.sort(compareSchedObj);

for (thisResult in schedObjArray) {
                curResult = schedObjArray[thisResult];
                if (!curResult.capIdString.equals(resultCapIdStringSave)) {
                                var capId = curResult.capId
                                
                                aa.env.setValue("PermitId1",capId.getID1());
                aa.env.setValue("PermitId2",capId.getID2());
                aa.env.setValue("PermitId3",capId.getID3());
    
                                if (SA) {
                                                eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA));
                                } else {
                                                eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
                                }

                                resultCapIdStringSave = capIDString;

                                logGlobals(AInfo);

                }
                //
                // Event Specific Details
                //

                inspId = curResult.inspId;
                inspInspector = curResult.inspector;
                var inspInspectorObj = aa.person.getUser(inspInspector).getOutput();
                if (inspInspectorObj) {

                                var InspectorFirstName = inspInspectorObj.getFirstName();
                                var InspectorLastName = inspInspectorObj.getLastName();
                                var InspectorMiddleName = inspInspectorObj.getMiddleName();
                } else {
                                var InspectorFirstName = null;
                                var InspectorLastName = null;
                                var InspectorMiddleName = null;
                }

                var inspSchedDate = curResult.date;
                var inspSchedTime = curResult.time;
                var inspAMPM = curResult.AMPM;
                var inspParent = curResult.parent;
                inspObj = aa.inspection.getInspection(capId, inspId).getOutput();
              //  var inspObj = curResult.inspObj;
              //  var inspGroup = curResult.inspObj.getInspection().getInspectionGroup();
                                                                            for (a in curResult) {if (typeof(curResult[a]) == "function") aa.print("function: " + a)}
                                      for (b in curResult) {if (typeof(curResult[b]) != "function") aa.print("attribute: " + b + " : " + curResult[b])}
                                      for (x in inspObj) {if (typeof(inspObj[x]) == "function") aa.print("function: " + x)}
                                      for (g in inspObj) {if (typeof(inspObj[g]) != "function") aa.print("attribute: " + g + " : " + inspObj[g])}
                                       //   inspGroup = inspObj.getInspection().getInspectionGroup();
                                      
           //     var inspType = curResult.inspObj.getInspectionType();
             //   var inspTime = curResult.time;
                
                // backward compatibility
          //     var InspectionTime = inspTime;
          //      var InspectionType = inspType;
          //      var InspectionGroup = inspGroup;

                
                aa.print("Inspection #" + thisResult);
                aa.print("inspId = " + inspId);
       //         logDebug("inspObj = " + inspObj.getClass());
      //          logDebug("inspGroup = " + inspGroup);
       //         logDebug("inspType = " + inspType);
                aa.print("inspInspector = " + inspInspector);
                aa.print("InspectorFirstName = " + InspectorFirstName);
                aa.print("InspectorMiddleName = " + InspectorMiddleName);
                aa.print("InspectorLastName = " + InspectorLastName);
                aa.print("inspSchedDate = " + inspSchedDate);
                aa.print("inspSchedTime = " + inspSchedTime);
                aa.print("inspAMPM = " + inspAMPM);
      //          logDebug("inspTime = " + inspTime);
                aa.print("inspParent = " + inspParent);

                var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", vEventName);
                
                if (preExecute.length)
                                doStandardChoiceActions(preExecute, true, 0); // run Pre-execution code

                if (doStdChoices)
                                doStandardChoiceActions(controlString, true, 0);

                if (doScripts)
                                doScriptActions();

                //
                // Check for invoicing of fees
                //
                if (feeSeqList.length) {
                                invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
                                if (invoiceResult.getSuccess())
                                                aa.print("Invoicing assessed fee items is successful.");
                                else
                                                aa.print("**ERROR: Invoicing the fee items assessed to app # " + capIDString + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
                }

}

/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0) {
                aa.env.setValue("ScriptReturnCode", "1");
                aa.env.setValue("ScriptReturnMessage", debug);
} else {
                if (cancel) {
                                aa.env.setValue("ScriptReturnCode", "1");
                                if (showMessage)
                                                aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);
                                if (showDebug)
                                                aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + debug);
                } else {
                                aa.env.setValue("ScriptReturnCode", "0");
                                if (showMessage)
                                                aa.env.setValue("ScriptReturnMessage", message);
                                if (showDebug)
                                                aa.env.setValue("ScriptReturnMessage", debug);
                }
}

function schedObj() {
                this.capId = null;
                this.capIdString = null;
                this.inspector = null;
                this.inspId = null;
                this.time = null;
                this.date = null;
                this.parent = null;
                this.AMPM = null;
                this.inspObj = null;
}

function compareSchedObj(a, b) {
               return (a.capIdString < b.capIdString);
}
