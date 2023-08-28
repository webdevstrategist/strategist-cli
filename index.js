#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { createSpinner } from 'nanospinner';
import { exec } from "child_process";
import figlet from 'figlet';

let projectName;
let preset;

function welcome() {
  const title = chalk.hex("#EA3A7A").bold("Welcome to webdevstrategist cli");
  console.log(title);
}


async function askName() {
  const name = await inquirer.prompt({
    name: "project_name",
    type: "input",
    message: "What is the project name?",
    default() {
      return "my-project";
    },
  });

  projectName = name;
}

async function askPreset() {
  const preset_q = await inquirer.prompt({
    name: "preset",
    type: "list",
    message: "Select the preset for boilerplate\n",
    choices: ["react", "node", "express"],
  });

  preset = preset_q;
}

function endgame() {
    console.clear();
    figlet(`Webdev Strategist`, (err, data) => {
        console.log(chalk.hex("#EA3A7A")(data));
    });
    console.log(chalk.green(`Next step: cd ${projectName.project_name} && npm install`))
  }

async function generate() {  
  console.clear();
  if (projectName.project_name) {
    const spinner = createSpinner('Generating boilerplate...').start();
    const clone = exec(
      `git clone git@github.com:webdevstrategist/react-starter.git ${projectName.project_name} && cd ${projectName.project_name} && git init && git remote remove origin`
    );
  
    clone.stdout.on("data", (data) => {
      chalk.redBright(console.log(`${data}`));
    });
  
    clone.stderr.on("data", (data) => {
        chalk.redBright(console.log(`${data}`));
    });
  
    clone.on("close", (code) => {
        spinner.success({ text: `child process exited with code ${code}` });
        endgame()
    });
  }
}



welcome();
await askName();
await askPreset();
await generate()
