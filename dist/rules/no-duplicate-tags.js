"use strict";

var _ = require('lodash');

var rule = 'no-duplicate-tags';

function noDuplicateTags(feature) {
  var errors = [];
  verifyTags(feature, errors);

  if (feature.children !== undefined) {
    feature.children.forEach(function (child) {
      verifyTags(child, errors);

      if (child.examples) {
        child.examples.forEach(function (example) {
          verifyTags(example, errors);
        });
      }
    });
  }

  return errors;
}

function verifyTags(node, errors) {
  var failedTagNames = [];
  var uniqueTagNames = [];
  (node.tags || []).forEach(function (tag) {
    if (!_.includes(failedTagNames, tag.name)) {
      if (_.includes(uniqueTagNames, tag.name)) {
        errors.push({
          message: 'Duplicate tags are not allowed: ' + tag.name,
          rule: rule,
          line: tag.location.line
        });
        failedTagNames.push(tag.name);
      } else {
        uniqueTagNames.push(tag.name);
      }
    }
  });
}

module.exports = {
  name: rule,
  run: noDuplicateTags
};