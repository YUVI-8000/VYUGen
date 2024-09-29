const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pprSchema = new Schema({
    course : {
        type : String,
        required : true,
    },
    branch : {
        type : String,
        required : true,
    },
    semester : {
        type : Number,
        required : true,
    },
    scheme : {
        type : Number,
        required : true,
    },
    subName : {
        type : String,
        required : true,
    },
    subCode: {
        type : String,
        required : true,
    },
    image: {
        type: String,
        required: true,
        default: "https://media.istockphoto.com/id/1339686801/photo/cloud-computing.jpg?s=1024x1024&w=is&k=20&c=DNcyEZ8jSTZ6H14KQOshIK8_ukxU4ZIRGzKLLsV8SJM=",
        set: (v) => v === "" ? "https://media.istockphoto.com/id/1339686801/photo/cloud-computing.jpg?s=1024x1024&w=is&k=20&c=DNcyEZ8jSTZ6H14KQOshIK8_ukxU4ZIRGzKLLsV8SJM=" : v,
    },
});

const ppr = mongoose.model("ppr",pprSchema);
module.exports = ppr;