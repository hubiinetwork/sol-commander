# SOL-COMMANDER

## About the SOL-COMMANDER

This is a command line interface that aims to verify contracts on Etherscan. It will automatically read the related ABI files and does necessary flattening of the sol files before verifying the contracts. Currently it only supports command `verify`, which accepts a couple of options for verification. For more details, please run `sol-commander verify --help`.

## Prerequisites

* To use this software you need a modern version of **NodeJS and NPM**.
  We recommend having the current LTS version (v8.x) installed, or
  later, and updating NPM to the latest available version. 
* You will also need an **API key** for access to the Etherscan's contract verification API.

## Installation

To install and make the command part of your path:

    npm install -g sol-commander

## Usage

To show the built-in help:

    sol-commander --help

or to show help for a specific sub-command:

    sol-commander <command> --help
