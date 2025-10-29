import { Command } from "commander";
import chalk from "chalk";
import { listCommand } from "./commands/list";
import { initCommand } from "./commands/init";
import { addCommand } from "./commands/add";

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
    .option('-c, --components', 'List only components')
    .option('-u, --utils', 'List only utilities')
    .action((options) => {
        listCommand(options);
    });

// Init commands
program
    .command("init")
    .description("Initialize a new project")
    .action(initCommand);

// Add commands
program
    .command("add")
    .description("Add a new component")
    .action(addCommand);

program.parse(process.argv);