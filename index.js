const Glue = require('glue');
const path = require('path');
const manifest = path.resolve(__dirname, 'manifest.json');
const config = require(manifest);

const options = {
    relativeTo: path.resolve(__dirname, 'lib')
};

const startServer = async function () {
    try {
        const server = await Glue.compose(config, options);
        await server.start();
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();
