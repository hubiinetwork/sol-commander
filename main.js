#!/usr/bin/env node
'use strict';

// eslint-disable-next-line no-unused-vars
const argv = require('yargs')
    .commandDir('./commands')
    .fail((msg, err) => {
        console.error(msg, err);
        process.exit(1);
    })
    .demandCommand()
    .help()
    .argv;
