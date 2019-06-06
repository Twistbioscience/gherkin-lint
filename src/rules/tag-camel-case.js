var _ = require('lodash');

var rule = 'tag-camel-case';

function camelCaseTags(feature) {
  var errors = [];

  verifyTagPattern(feature, errors);
  if (feature.children !== undefined) {
    feature.children.forEach(function(child) {
      verifyTagPattern(child, errors);

      if (child.examples) {
        child.examples.forEach(function(example) {
          verifyTagPattern(example, errors);
        });
      }
    });
  }
  return errors;
}

function verifyTagPattern(node, errors) {
  var failedTagNames = [];
  var uniqueTagNames = [];
  (node.tags || []).forEach(function(tag) {
    if (!tag.name.match(/[a-z]+[A-Z0-9][a-z0-9]+[A-Za-z0-9]*/)) {
        errors.push({message: 'tags should be in camelCase: ' + tag.name,
          rule   : rule,
          line   : tag.location.line});
        failedTagNames.push(tag.name);
      } else  {
        uniqueTagNames.push(tag.name);
      }
  });
}

module.exports = {
  name: rule,
  run: camelCaseTags
};
