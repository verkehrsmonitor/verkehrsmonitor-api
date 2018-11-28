const Boom = require('boom');
const csv = require('fast-csv');
const { PassThrough } = require('stream');

const formatDate = date => date.getTime() / 1000;
const transform = doc => {
    if (doc.date) doc.date = formatDate(doc.date);
    return doc;
};

function query(db, collection, verb, query, fields={}, sort, limit) {
    const csvFormat = csv.createWriteStream({headers: true, objectMode: false});
    const stream = new PassThrough({objectMode: false});

    // query the DB
    fields._id = false;
    db.collection(collection)[verb](query, fields)
        .limit(limit)
        .sort(sort)
        .stream({ transform, objectMode: false }) // format doc
        .pipe(csvFormat) // transform to csv
        .pipe(stream); // pipe to output

    return stream;
};

exports.register = (server, options) => {
    // init defaults
    const name = options.name || 'query';

    server.method(name, query);
};

exports.name = 'query';
exports.dependencies = [];
