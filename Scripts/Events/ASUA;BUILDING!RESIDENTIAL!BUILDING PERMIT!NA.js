// Enter your script here...


//var v_workDesc =  workDescGet(capId);
//var v_length = v_workDesc.length();
//if (v_length > 254) {
//   v_length = 254;
//}  
//var v_workDesc = v_workDesc.substring(0,v_length);
//var setDescription = updateShortNotes(v_workDesc,capId);

//var cTypeArray;
var childId;

cTypeArray = new Array("Building","Residential","Building Permit","Trade Contractor");
childId = createChildTempRecord(cTypeArray);

showMessage = true;
comment("childId =" + childId);