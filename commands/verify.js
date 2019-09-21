'use strict';

const fs = require('fs');
const verify = require('truffle-plugin-verify');

module.exports = {
    command: 'verify <path> [--apikey=<APIKEYSTRING>] [--network_id=<network id>] [--optimization=<optimization>] [--runs=<optimization runs>] [--contracts=<Only verify the specified contracts>]',
    describe: 'Verify contracts under <path> using etherscan <apikey>',
    builder: yargs => {
        yargs.example('verify /PATH/TO/PROJECT/FOLDER --apikey=APIKEYSTRING', 'Verify the contracts under the folder "/PATH/TO/PROJECT/FOLDER" using Etherscan API KEY "APIKEYSTRING".');
        yargs.example('verify /PATH/TO/PROJECT/FOLDER --apikey=APIKEYSTRING --network_id=3', 'Verify contracts on mainnet.');
        yargs.example('verify /PATH/TO/PROJECT/FOLDER --apikey=APIKEYSTRING --optimization=true --runs=1', 'Verify contracts using optimization setting with 1 runs.');
        yargs.example('verify /PATH/TO/PROJECT/FOLDER --apikey=APIKEYSTRING --contracts ContractA ContractB', 'Only verify contracts in names of ContractA and Contract B.');
        yargs.example('verify /PATH/TO/PROJECT/FOLDER --apikey=APIKEYSTRING --contracts ContractA@ADDRESS_OF_CONTRACT_A ContractB', 'Only verify contracts in names of ContractA and Contract B, where the address of ContractA is overridden.');
        yargs.option('apikey', {
            desc: 'The Etherscan API KEY',
            type: 'string'
        });
        yargs.option('network_id', {
            desc: 'The ID of the network, on which the verification should run. "1" for mainnet. "3" for ropsten.',
            default: '1',
            type: 'string',
            choices: ['1', '3']
        });
        yargs.option('path', {
            desc: 'The path to the truffle structured project. It should contain the "contracts" folder for the sol source files, and "build/contracts" folder for the compiled ABI files.',
            default: false,
            type: 'string'
        });
        yargs.option('optimization', {
            desc: 'Whether the contracts are compiled with optimization setting',
            default: false,
            type: 'boolean'
        });
        yargs.option('runs', {
            desc: 'Optimization runs. This option is only effective when --optimization=true',
            default: 200,
            type: 'number'
        });
        yargs.option('contracts', {
            desc: 'Only verify a subset of the contracts corresponding to the ABI files under the build/contracts folder, optionally with explicit address override(s). By default, it attempts to verify all the contracts corresponding to the ABI files under the build/contracts folder.',
            default: [],
            type: 'array'
        });
        yargs.demandOption(['apikey', 'path'], 'Please provide both apikey and path arguments');
    },
    handler: async (argv) => {
        const {
            apikey,
            path,
            network_id,
            optimization,
            runs,
            contracts
        } = argv;

        const working_directory = path;
        const build_directory = `${working_directory}/build`;
        const contracts_build_directory = `${build_directory}/contracts`;

        let contractsToVerify;
        if (contracts.length > 0) {
            contractsToVerify = contracts;
        }
        else {
            const files = fs.readdirSync(contracts_build_directory);
            const allContractNames = files.map(filename => filename.split('.')[0]);
            contractsToVerify = allContractNames;
        }

        const configs = {
            network_id,
            build_directory,
            working_directory,
            contracts_build_directory,
            compilers: {
                solc: {
                    settings: {
                        optimizer: {
                            enabled: false
                        }
                    }
                }
            },
            api_keys: {
                etherscan: apikey
            },
            _: [null].concat(contractsToVerify)
        };


        if (optimization) {
            configs.compilers = {
                solc: {
                    settings: {
                        optimizer: {
                            enabled: optimization,
                            runs
                        }
                    }
                }
            };
        }

        await verify(configs);
    }
};