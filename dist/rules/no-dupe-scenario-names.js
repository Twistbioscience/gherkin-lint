"use strict";

var rule = 'no-dupe-scenario-names';
var scenarios = [];
var availableConfigs = ['anywhere', 'in-feature'];

function noDuplicateScenarioNames(feature, file, configuration) {
  var errors = [];

  if (configuration === 'in-feature') {
    scenarios = [];
  }

  if (feature && feature.children) {
    feature.children.forEach(function (scenario) {
      // Backgrounds can have duplicate 'names'
      if (scenario.type === 'Scenario' && scenario.name) {
        if (scenario.name in scenarios) {
          var dupes = getFileLinePairsAsStr(scenarios[scenario.name].locations);
          scenarios[scenario.name].locations.push({
            file: file.name,
            line: scenario.location.line
          });
          errors.push({
            message: 'Scenario name is already used in: ' + dupes,
            rule: rule,
            line: scenario.location.line
          });
        } else {
          scenarios[scenario.name] = {
            locations: [{
              file: file.name,
              line: scenario.location.line
            }]
          };
        }
      }
    });
  }

  return errors;
}

function getFileLinePairsAsStr(objects) {
  var strings = [];
  objects.forEach(function (object) {
    strings.push(object.file + ':' + object.line);
  });
  return strings.join(', ');
}

module.exports = {
  name: rule,
  run: noDuplicateScenarioNames,
  availableConfigs: availableConfigs
};