// Enter your script here...
//showDebug=true;

//logDebug("I am here");



var fee_va3 = feeQty("VAL3"); //Low Voltage Audio Wiring and Sound Systems
var fee_va4 = feeQty("VAL4"); //Low Voltage Comm. Antenna and Cable TV Systems
var fee_va5 = feeQty("VAL5"); //Low Voltage Information Technology Wiring Systems
var fee_va6 = feeQty("VAL6"); //Low Voltage Intrinsically Safe Wiring Systems
var fee_va7 = feeQty("VAL7"); //Low Voltage Lighting Systems
var fee_va8 = feeQty("VAL8"); //Low Voltage Network-Powered Broadband Comm. Systems
var fee_va9 = feeQty("VAL9"); //Low Voltage Optical Fiber Wiring System
var fee_va10 = feeQty("VAL10"); //Low Voltage Telecommunication Wiring System
var fee_va12 = feeQty("VAL12"); //Low Voltage Other Systems


var v_lowvoltage_subtotal =
fee_va3 +
fee_va4 +
fee_va5 +
fee_va6 +
fee_va7 +
fee_va8 +
fee_va9 +
fee_va10 +
fee_va12;

if (v_lowvoltage_subtotal > 0) {
   if (feeExists("LVPL_SUBTOT")== false) {
    addFee("LVPL_SUBTOT","BLD_ELE", "STANDARD", v_lowvoltage_subtotal, "N");
    }
else {
   updateFee("LVPL_SUBTOT","BLD_ELE", "STANDARD", v_lowvoltage_subtotal, "N");
    }
   if (feeExists("LVPL_TOTAL")== false) {
    addFee("LVPL_TOTAL","BLD_ELE", "STANDARD", v_lowvoltage_subtotal, "N");
    }
else {
   updateFee("LVPL_TOTAL","BLD_ELE", "STANDARD", v_lowvoltage_subtotal, "N");
    }
  }

if (v_lowvoltage_subtotal == 0) {
   if (feeExists("LVPL_TOTAL")== true) {
   updateFee("LVPL_TOTAL","BLD_ELE", "STANDARD", 0, "N");
    }
   if (feeExists("LVPL_SUBTOT")== true) {
   updateFee("LVPL_SUBTOT","BLD_ELE", "STANDARD", 0, "N");
    }
}
