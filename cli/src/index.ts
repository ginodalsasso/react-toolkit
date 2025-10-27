import { Command } from "commander";
import chalk from "chalk";

const program = new Command();

/*
    CLI Definition
    npm run dev -- --help:
    Usage: my-cli [options] [command]
    A simple CLI tool

    Options:
        -V, --version        output the version number
        -h, --help           display help for command
    Commands:
        serve                Start the development server
        build                Build the project
*/
program
    .name("my-cli")
    .description("A simple CLI tool with react and js toolkit")
    .version("1.0.0");

// List commands
program
    .command("list")
    .description("List all components and utils")
    .action(() => {
        console.log(chalk.yellow("Listing all components..."));
    });

// Init commands
program
    .command("init")
    .description("Initialize a new project")
    .action(() => {
        console.log(chalk.green("Initializing a new project..."));
    });

// Add commands
program
    .command("add")
    .description("Add a new component")
    .action(() => {
        console.log(chalk.blue("Adding a new component..."));
    });

program.parse(process.argv);