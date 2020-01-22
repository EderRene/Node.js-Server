'use strict';

const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const workingHoursSchema2 = new Schema({
    mid: {type: Number, unique: true},
    year: {type: Number, unique: true},
    workingHoursYear: [
        {
            month: {type: Number},
            workingHoursMonth: [
                {
                    week: {type: Number},
                    workingHoursWeek: [
                        {
                            day: {type: Number},
                            forenoon: {
                                workingTime: {type: Number},
                                workInfo: {type: String}
                            },
                            afternoon: {
                                workingTime: {type: Number},
                                workInfo: {type: String}
                            }
                        }
                    ]
                }
            ]
        }
    ]
});

const workingHoursSchema = new Schema({
    mid: {type: Number, unique: true},
    workingDate: {type: String},
    workingHours: {
        forenoon: {
            startTime: {type: Number},
            endTime: {type: Number},
            info: {type: String}
        },
        afternoon: {
            startTime: {type: Number},
            endTime : {type: Number},
            info: {type: String}
        }
    }
});

module.exports=mongoose.model('workingHours', workingHoursSchema);
