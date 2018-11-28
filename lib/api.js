const Boom = require('boom');
const { model } = require('./model');

const apiHandler = (dbName, defaultCollection) =>
    async (request, h) => {
        // extract context
        const db = request[dbName].db;
        const { query } = request;
        let collection = defaultCollection;

        // filter fields
        query.fields = query.fields || [];
        const fields = query.fields.reduce((res, field) => {
            res[field] = true;
            return res;
        }, {});
        delete query.fields;

        // date range filter
        if (!query.date) {
            if (query.fromDate) {
                query.date = {};
                query.date['$gte'] = query.fromDate;
                delete query.fromDate;
            }

            if (query.toDate) {
                query.date = query.date || {};
                query.date['$lt'] = query.toDate;
                delete query.toDate;
            }

            // offer best timerange
            if (defaultCollection === 'auto' && query.date['$lt'] && query.date['$lt']) {
                const timeDiff = Math.abs(query.date['$gte'] - query.date['$lt']);
                const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                if (diffDays > 4) collection = 'by_day';
                if (diffDays > 31) collection = 'by_month';
                if (diffDays > 365) collection = 'by_year';
                if (collection === 'auto') collection = 'measures';
            }
        }

        // geospatial queries
        if (query.lat && query.lng && query.distance) {
            query.location = {
                $near: [query.lng, query.lat],
                $maxDistance: query.distance / 6371 //km to radians
            };
            delete query.lng;
            delete query.lat;
            delete query.distance;
        }

        // sort
        let sort = {};
        if (query.sort) {
            sort[query.sort] = query.order || -1;
            delete query.sort;
            delete query.order;
        }

        // limit
        let limit = 0;
        if (query.limit) {
            limit = query.limit;
            delete query.limit;
        }

        // query the DB
        try {
            const result = await request.server.methods.query(db, collection, 'find', query, fields, sort, limit);
            const lastModified = new Date('2017-01-01').toUTCString();
            return h.response(result)
                .type('text/csv; charset=utf-8')
                .header('last-modified', lastModified)
                .header('X-Timerange', collection);
        } catch (err) {
            console.log(err);
            throw Boom.internal('Internal error', err);
        }
    };

exports.register = (server, options) => {
    // init defaults
    const method = options.method || 'GET';
    const path = options.path || '/';
    const cache = {
        expiresIn: options.cache || 365 * 24 * 60 * 60 * 1000,
        privacy: 'private'
    };
    const db = options.db || 'db';
    const collection = options.collection || 'test';

    // register route
    server.route({
        method,
        path,
        handler: apiHandler(db, collection),
        config: {
            validate: {
                query: model
            },
            cache
        }
    });
};

exports.name = 'api';
exports.multiple = true;
exports.dependencies = ['hapi-mongodb', 'query'];
