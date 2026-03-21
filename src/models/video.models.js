
import mongoose , {Schema} from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema({
    videoFile:{
        type: String, // URL of the video file from cloudfare
        required: true,
    },
    thumbnail:{
        type: String, // URL of the thumbnail image from cloudfare
        required: true,
    },
    title:{
        type: String,
        required: true, 
    },
    description:{
        type: String,
        required: true,
    },
    duration:{
        type: Number, // Duration of the video in seconds
        required: true,
        },
    views:{
        type: Number,
        default: 0,
    },
    ispublished:{
        type: Boolean,
        default: true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

},{timestamps: true}
)
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);