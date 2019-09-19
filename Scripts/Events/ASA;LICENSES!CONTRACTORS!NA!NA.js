//AUTO ADD FEES
// 



var v_class;
  var v_sub_type = AInfo["Sub Type"];

  if (v_sub_type == "Electrical") {
      v_class = AInfo["Electrical License Class"];
 };
  if (v_sub_type == "Gas") {
      v_class = AInfo["Gas License Class"];
 };
  if (v_sub_type == "Mechanical") {
      v_class = AInfo["Mechanical License Class"];
 };
  if (v_sub_type == "Plumbing") {
      v_class = AInfo["Plumbing Class"];
 };


var workDesc = v_sub_type + "-" +   v_class.substring(0, 2);

var setDescription = updateWorkDesc(workDesc);


editAppSpecific("Class",v_class);

var v_fee = "LCON_" + v_class.substring(0, 2);

addFee(v_fee, "LICENSED_CONTRACTORS", "STANDARD",1,"Y");