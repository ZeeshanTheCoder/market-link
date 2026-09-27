import mongoose from "mongoose";
const pickupSlotSchema = new mongoose.Schema({
  farmerId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},
  marketId:{type:mongoose.Schema.Types.ObjectId,ref:"Market",required:true,index:true},
  date:{type:Date,required:true,index:true}, day:{type:String,required:true}, start:{type:String,required:true}, end:{type:String,required:true},
  capacity:{type:Number,required:true,min:1,default:6}, booked:{type:Number,min:0,default:0}, active:{type:Boolean,default:true}, recurring:{type:Boolean,default:false}
},{timestamps:true});
pickupSlotSchema.index({farmerId:1,date:1,start:1},{unique:true});
export default mongoose.model("PickupSlot",pickupSlotSchema);
