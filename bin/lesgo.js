#!/usr/bin/env node

const { execSync } = require('child_process');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');
const babelPreset = require('@babel/preset-env');

const optionsTabPrefix = 4;
const optionsList = [
  {
    signature: '-h, --help',
    description:
      'Display help for the given command. When no command is given display help for the list command',
  },
];

('use strict');

/*eslint-disable no-console*/
if (['-h', '--help', 'help', undefined].includes(process.argv[2])) {
  help();
}

findAndRequireCommands(function(group, commandName, command) {
  if (process.argv[2] === commandName) {
    const commandParams = getCommandParams(command);

    command.handle(...commandParams);

    return false;
  }
});

function help() {
  const colorize = function(text, color) {
    const colors = {
      green: '\u001b[32m',
      reset: '\u001b[0m',
      yellow: '\u001b[33m',
    };

    return `${colors[color]}${text}${colors.reset}`;
  };

  const version = execSync('npm view lesgo version')
    .toString()
    .trim();
  console.log(`Lesgo Framework ${colorize(version, 'green')}`);
  console.log(colorize('\nUsage:', 'yellow'));
  console.log(`  command [options] [arguments]`);
  console.log(colorize('\nOptions:', 'yellow'));
  optionsList.forEach(function(option) {
    console.log(
      `${colorize(`  ${option.signature}`, 'green')}${Array(optionsTabPrefix)
        .fill(' ')
        .join('')}${option.description}`
    );
  });
  console.log(colorize('\nAvailable commands:', 'yellow'));

  // Placeholder for list of commands
  const commandGroups = {
    default: [
      {
        command: {
          signature: 'help',
          description: 'Displays help for a command',
        },
        commandName: 'help',
      },
    ],
  };
  let commandsTabPrefix = commandGroups.default[0].commandName.length + 4;

  // Find and require files under src/commands
  findAndRequireCommands(function(group, commandName, command) {
    if (!commandGroups[group]) {
      commandGroups[group] = [];
    }

    commandsTabPrefix = Math.max(commandsTabPrefix, commandName.length + 4);

    commandGroups[group].push({
      command,
      commandName,
    });
  });

  // Display list of comamnds and their descriptions
  for (const key in commandGroups) {
    if (commandGroups[key].length && key !== 'default') {
      console.log(colorize(key, 'yellow'));
    }

    commandGroups[key].forEach(function(command) {
      console.log(
        `${colorize(`  ${command.commandName}`, 'green')}${Array(
          commandsTabPrefix - command.commandName.length
        )
          .fill(' ')
          .join('')}${command.command.description}`
      );
    });
  }
}

function getCommandParams(command) {
  const summary = {};
  const optsArgs = [{}, {}];
  const processArgs = process.argv.splice(2).join(' ');
  const paddingRegex = '(--[^ ]+( |$))*';
  let matches = [];

  /**
   * Created a pattern to match options in order
   */
  const signatureRegex = new RegExp(
    command.signature.replace(/\{([^\}]+)\}(?:\s|$)/g, function(matched) {
      let key = matched.trim().slice(1, -1);
      let isArgs = false;

      if ((matches = /(--)?([^\s=]+)(=)?([^\s]+)?/.exec(key))) {
        key = matches[2];
        const argsEquals = matches[3],
          argsDefault = matches[4];
        isArgs = !!matches[1];

        summary[key] = {
          boolean: isArgs && !argsEquals ? true : false,
          default: argsDefault,
          type: isArgs ? 'args' : 'opts',
        };

        if (isArgs) {
          // Extract the value right away if this is an argument
          const argsSignatureRegex = new RegExp(`.*--${key}=?([^\\s]+)?.*`);
          let filteredValue = summary[key].boolean ? false : undefined;
          if ((matches = argsSignatureRegex.exec(processArgs))) {
            summary[key].value = summary[key].boolean ? true : matches[1];
          }
        }
      } else {
        throw new Error(`Invalid key '${key}' present in signature`);
      }

      return !isArgs ? `${paddingRegex}((?<${key}>(?!--)[^ ]+)( |$))?` : '';
    }) + paddingRegex
  );

  // Match the pattern specific ones
  if ((matches = signatureRegex.exec(processArgs))) {
    for (var key in matches.groups) {
      summary[key].value = matches.groups[key];
    }
  }

  for (var key in summary) {
    const property = summary[key];
    let index = 0;
    let filteredValue = property.value;

    if (property.type === 'args') {
      index = 1;
    }

    if (filteredValue === undefined) {
      filteredValue = property.default;
    }

    optsArgs[index][key] = filteredValue;
  }

  return optsArgs;
}

function findAndRequireCommands(callback) {
  try {
    glob.sync('./src/commands/*.js').forEach(function(file) {
      const commandFile = path.resolve(
        `./.serverless/build/${path.basename(file)}.js`
      );
      fs.mkdirSync(path.dirname(commandFile), { recursive: true });
      fs.writeFileSync(
        commandFile,
        babel.transformFileSync(path.resolve(file)).code
      );
      const command = require(commandFile).default;
      const commandGroup = command.signature.replace(/ .+$/, '').split(':');
      if (commandGroup.length < 2) {
        commandGroup.splice(0, 0, 'default');
      }
      const commandName = commandGroup.join(':');

      if (callback(commandGroup[0], commandName, command) === false) {
        throw 'break';
      }
    });
  } catch (e) {
    if (e !== 'break') {
      throw e;
    }
  }
}
