AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/OPERATNS/NA/NA";
assignCapToDept(AssignedToDept);

var meterbagging = AInfo["Meter Bagging"];
var nonmeteredspace = AInfo["Non-Metered Space"];
var annualpermit = AInfo["Annual Permit"];
var meterremoval = AInfo["Meter Removal"];

var v_workDesc = workDescGet(capId);
var v_length = v_workDesc.length();
if (v_length > 255) {
    v_length = 255;
}


var v_shortworkDesc = v_workDesc.substring(0, v_length);

//var v_shortworkDesc = v_workDesc;

var setDescription = updateShortNotes(v_shortworkDesc);



var request = "Request=";
if (meterbagging == "CHECKED") {
    request = request + "Meter Bagging ";
   }
if (nonmeteredspace == "CHECKED") {
    request = request + "Nonmetered Space ";
   }
if (annualpermit == "CHECKED") {
    request = request + "Annual Permit ";
   }
if (meterremoval == "CHECKED") {
    request = request + "Meter Removal ";
   }


var workDesc = workDescGet(capId);

workDesc = request + "\r" + workDesc;
 
var setDescription = updateWorkDesc(workDesc);
