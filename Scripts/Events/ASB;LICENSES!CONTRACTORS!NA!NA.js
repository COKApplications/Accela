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

 if(isEmpty(v_class) == true) {
    showMessage = true;
    comment("ASI Class for Sub Type Is Missing");
    cancel = true;
    }
