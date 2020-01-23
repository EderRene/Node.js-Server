'use strict';

const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const workingHoursSchema = new Schema({
    eid: {type: Number, unique: true},
    workingDate: {type: String},
    workingHours: {
        forenoon: {
            startTime: {type: Number},
            endTime: {type: Number},
            info: {type: String}
        },
        afternoon: {
            startTime: {type: Number},
            endTime: {type: Number},
            info: {type: String}
        }
    }
});

module.exports=mongoose.model('workingHours', workingHoursSchema);