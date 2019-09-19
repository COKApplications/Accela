AssignedToDept = "KNOXVILLE/KNOX/SPEVENTS/NA/NA/NA/NA";
assignCapToDept(AssignedToDept);


updateAppStatus("Applied", "Updated by Script.");
var myAltId = capId.getCustomID();
var dbName = "jetspeed";
var sql;
v_eventname = AInfo["Event Name"];
sql = "update accela.b1permit set B1_SPECIAL_TEXT = '"; 
sql = sql + v_eventname + "' where b1_alt_id = '";
sql = sql + myAltId + "'";
//var updateresult = aa.util.update(dbName, sql, null);
//bpermit_detail b1_short_notes
var v_workdesc = workDescGet(capId);
//sql = "update accela.bpermit_detail set B1_SHORT_NOTES = '"; 
//sql = sql + v_workdesc + "' where b1_alt_id = '";
//sql = sql + myAltId + "'";