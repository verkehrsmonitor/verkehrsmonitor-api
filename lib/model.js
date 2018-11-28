const Joi = require('joi');

module.exports.model = {
    nr: Joi.number(),
    date: Joi.date(),
    total_1: Joi.number(),
    total_2: Joi.number(),
    truck_1: Joi.number(),
    truck_2: Joi.number(),
    name: Joi.string(),
    land: Joi.string().min(2).max(2),
    type: Joi.string(),
    roadid: Joi.number(),
    lat: Joi.number(),
    lng: Joi.number(),
    fromDate: Joi.date(),
    toDate: Joi.date(),
    fields: Joi.array(),
    distance: Joi.number(),
    limit: Joi.number(),
    sort: Joi.string(),
    order: Joi.number().min(-1).max(1)
};
