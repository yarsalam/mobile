#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const [reportPath, lockPath] = process.argv.slice(2);
if (!reportPath || !lockPath) {
  console.error('Usage: node scripts/check-mobile-dependency-audit.cjs <audit-report.json> <package-lock.json>');
  process.exit(2);
}
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const vulnerabilities = report.vulnerabilities || {};
const counts = (report.metadata && report.metadata.vulnerabilities) || {};
if (!report.metadata || !report.metadata.vulnerabilities || !report.vulnerabilities) {
  console.error('Blocking: npm audit did not return a complete vulnerability report.');
  process.exit(1);
}
const actualHigh = Object.values(vulnerabilities).filter((item) => item.severity === 'high').length;
const actualCritical = Object.values(vulnerabilities).filter((item) => item.severity === 'critical').length;
if (actualHigh !== (counts.high || 0) || actualCritical !== (counts.critical || 0)) {
  console.error('Blocking: npm audit summary counts do not match the detailed vulnerability entries.');
  process.exit(1);
}
const ALLOWED_ADVISORY = 'https://github.com/advisories/GHSA-fc5q-39xc-vjpf';
const ALLOWED_HIGH_PACKAGES = new Set([
  '@react-native-community/cli','@react-native-community/cli-clean','@react-native-community/cli-config',
  '@react-native-community/cli-config-android','@react-native-community/cli-config-apple',
  '@react-native-community/cli-doctor','@react-native-community/cli-platform-android',
  '@react-native-community/cli-platform-apple','@react-native-community/cli-platform-ios',
  '@react-native/babel-plugin-codegen','@react-native/babel-preset','@react-native/codegen',
  '@react-native/community-cli-plugin','@react-native/metro-babel-transformer','@react-native/metro-config',
  '@react-native/new-app-screen','@react-native/virtualized-lists','fast-glob','fdir','jest-util',
  'jest-worker','metro','metro-config','metro-file-map','metro-transform-worker','micromatch',
  'picomatch','react-native','tinyglobby'
]);
const PICOMATCH_BUILD_PARENTS = new Set(['anymatch','jest-util','micromatch','tinyglobby']);
const XML_BUILD_PARENTS = new Set([
  '@react-native-community/cli-config-android',
  '@react-native-community/cli-platform-apple'
]);

function packageNameFromLockPath(path) {
  const parts = path.split('/');
  const index = parts.lastIndexOf('node_modules');
  if (index < 0 || !parts[index + 1]) return null;
  if (parts[index + 1].startsWith('@')) return parts[index + 1] + '/' + (parts[index + 2] || '');
  return parts[index + 1];
}
function parentsOf(name) {
  return Object.entries(lock.packages || {})
    .filter((entry) =>
      Object.prototype.hasOwnProperty.call(entry[1].dependencies || {}, name) ||
      Object.prototype.hasOwnProperty.call(entry[1].optionalDependencies || {}, name))
    .map((entry) => packageNameFromLockPath(entry[0]))
    .filter(Boolean);
}
function terminalAdvisories(name, stack) {
  stack = stack || new Set();
  if (stack.has(name)) return new Set();
  const entry = vulnerabilities[name];
  if (!entry) throw new Error('Unresolved npm audit dependency reference: ' + name);
  const next = new Set(stack);
  next.add(name);
  const urls = new Set();
  for (const via of entry.via || []) {
    if (typeof via === 'string') {
      for (const url of terminalAdvisories(via, next)) urls.add(url);
    } else if (via && typeof via.url === 'string') {
      urls.add(via.url);
    } else {
      throw new Error('Unrecognized advisory entry in ' + name);
    }
  }
  return urls;
}

const blocking = Object.entries(vulnerabilities)
  .filter((entry) => entry[1].severity === 'high' || entry[1].severity === 'critical');
if (blocking.length === 0) {
  console.log('Mobile dependency audit passed: ' + (counts.critical || 0) + ' critical, ' + (counts.high || 0) + ' high.');
  process.exit(0);
}
const unknownPackages = blocking.map((entry) => entry[0]).filter((name) => !ALLOWED_HIGH_PACKAGES.has(name));
if (unknownPackages.length) {
  console.error('Blocking: unreviewed high/critical packages: ' + unknownPackages.join(', '));
  process.exit(1);
}
for (const entry of blocking) {
  const name = entry[0];
  let advisories;
  try {
    advisories = terminalAdvisories(name);
  } catch (error) {
    console.error('Blocking: ' + error.message);
    process.exit(1);
  }
  if (advisories.size !== 1 || !advisories.has(ALLOWED_ADVISORY)) {
    console.error('Blocking: ' + name + ' is affected by an unapproved or unresolved advisory: ' + ([...advisories].join(', ') || 'none'));
    process.exit(1);
  }
}
const picomatchParents = parentsOf('picomatch');
if (picomatchParents.length === 0 || picomatchParents.some((name) => !PICOMATCH_BUILD_PARENTS.has(name))) {
  console.error('Blocking: picomatch is no longer confined to reviewed build-tool parents: ' + picomatchParents.join(', '));
  process.exit(1);
}
const xmlParents = parentsOf('fast-xml-parser');
if (xmlParents.some((name) => !XML_BUILD_PARENTS.has(name))) {
  console.error('Blocking: fast-xml-parser is referenced outside reviewed React Native CLI tooling: ' + xmlParents.join(', '));
  process.exit(1);
}
console.log('Mobile dependency audit passed with one narrowly scoped build-toolchain exception.');
console.log('High findings: ' + blocking.length + ' npm package entries, all cascading from ' + ALLOWED_ADVISORY + '.');
console.log('picomatch parents in lockfile: ' + [...new Set(picomatchParents)].join(', ') + ' (build tooling only; not packaged in APK).');
console.log('Low fast-xml-parser parent packages: ' + [...new Set(xmlParents)].join(', '));
console.log('Any new advisory, affected package, or runtime dependency path remains blocking.');
if ((counts.low || 0) > 0) console.warn('Non-blocking low findings: ' + counts.low + '. Review the uploaded npm audit artifact.');
