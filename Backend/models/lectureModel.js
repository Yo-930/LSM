import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true
    },
    videoUrl:{
        type: String,
    },
    isPreviewFree:{
        type: Boolean,
        default: false
    }



}, { timestamps: true });

const LectureModel = mongoose.model('Lecture', lectureSchema);