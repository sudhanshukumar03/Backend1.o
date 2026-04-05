import mongoose, {Schema} from "mongoose";
import mongoosAggregatePageinate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema({
    videofile: {
        type:String, 
        require

    },
    thumbnail: {
        type:String,
        required:true,  
    },
    title: {
        type:String,    
        required:true,
        trim:true,
        index:true
    },
    description: {
        type:String,
        required:true,
        trim:true,      
    },
    duration: {
        type:Number,
        required:true,  
    },
    views: {
        type:Number,    
        default:0
    },
    isPublished: {
        type:Boolean,
        default:false
    },
    owner: {
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    uploadedby: {
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

})
videoSchema.plugin(mongoosAggregatePageinate);
{timestamps:true}
export const video =mongoose.model("Video", videoSchema);   