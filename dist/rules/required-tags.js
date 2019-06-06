"use strict";

var rule = 'required-tags';
var availableConfigs = {
  tags: []
};

var checkTagExists = function checkTagExists(requiredTag, scenarioTags, scenarioType) {
  var result = scenarioTags.length == 0 || scenarioTags.some(function (tagObj) {
    return RegExp(requiredTag).test(tagObj.name);
  });

  if (!result) {
    var lines = [];
    scenarioTags.forEach(function (tag) {
      if (lines.indexOf(tag.location.line) === -1) {
        lines.push(tag.location.line);
      }
    });
    return {
      message: `No tag found matching ${requiredTag} for ${scenarioType}`,
      rule,
      line: lines.join(',')
    };
  }

  return result;
};

var checkRequiredTagsExistInScenarios = function checkRequiredTagsExistInScenarios(feature, file, config) {
  var errors = [];

  if (feature.children) {
    feature.children.forEach(function (scenario) {
      // Check each Scenario for the required tags
      var requiredTagErrors = config.tags.map(function (requiredTag) {
        return checkTagExists(requiredTag, scenario.tags || [], scenario.type);
      }).filter(function (item) {
        return typeof item === 'object' && item.message;
      }); // Update errors

      errors = errors.concat(requiredTagErrors);
    });
  }

  return errors;
};

module.exports = {
  name: rule,
  run: checkRequiredTagsExistInScenarios,
  availableConfigs: availableConfigs
};