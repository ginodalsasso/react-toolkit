import { Command } from "commander";
import chalk from "chalk";
import { listCommand } from "./commands/list";
import { initCommand } from "./commands/init";
import { addCommand } from "./commands/add";
import { removeCommand } from "./commands/remove";
import { statusCommand } from "./commands/status";

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
        init                 Initialize a new project
        list [options]       List all components and utils
        add [name]           Add a new component
        remove [name]        Remove an existing component or utility
        status [name]       Compare installed components/utils with registry versions
*/

program
    .name("my-cli")
    .description("A simple CLI tool with react and js toolkit")
    .version("1.0.0");
    
// Init commands
program
    .command("init")
    .description("Initialize a new project")
    .action(initCommand);

// List commands
program
    .command("list")
    .description("List all components and utils")
    .option('-c, --components', 'List only components')
    .option('-u, --utils', 'List only utilities')
    .action((options) => {
        listCommand(options);
    });

// Add commands
program
    .command("add [name]")
    .description("Add a new component")
    .action((name) => {
        addCommand(name);
    });

// Remove commands
program
    .command("remove [name]")
    .description("Remove an existing component or utility")
    .action((name) => {
        removeCommand(name);
    });

// Status commands
program
    .command("status [name]")
    .description("Compare installed components/utils with registry versions to show the status")
    .option("-d, --detailled", "Show detailed differences")
    .action((name, options) => {
        statusCommand(name, options);
    });

// Diff commands
program
    .command("diff [name]")
    .description("Show differences between installed and registry versions of a component or utility")
    .action((name) => {
        diffCommand(name);
    });


program.parse(process.argv);