/* @flow */

import appendPxIfNeeded from './append-px-if-needed';
import camelCasePropsToDashCase from './camel-case-props-to-dash-case';
import mapObject from './map-object';
import {getPrefixedStyle} from './prefixer';

function createMarkupForStyles(style: Object): string {
  let styles = '';
  Object.keys(style).forEach(function(property) {
    const value = style[property];
    if (Array.isArray(value)) {
      value.forEach(function(vendorPrefixedValue) {
        styles += property + ': ' + vendorPrefixedValue + ';\n';
      });
    } else {
      styles += property + ': ' + value + ';\n';
    }
  });
  return styles.trim();
}

export default function cssRuleSetToString(
  selector: string,
  rules: Object,
  userAgent: ?string
): string {
  if (!rules) {
    return '';
  }

  const rulesWithPx = mapObject(rules, (value, key) =>
    appendPxIfNeeded(key, value));
  const prefixedRules = getPrefixedStyle(rulesWithPx, userAgent);
  const cssPrefixedRules = camelCasePropsToDashCase(prefixedRules);
  const serializedRules = createMarkupForStyles(cssPrefixedRules);

  return selector + '{' + serializedRules + '}';
}
