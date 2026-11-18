# Mobile npm audit policy

## Why the Android audit needs a mobile-specific policy

A React Native APK is a compiled native application with a bundled JavaScript payload. It does not ship the repository's Node.js node_modules tree as an executable Node service.

The current lockfile contains one high-severity advisory, GHSA-fc5q-39xc-vjpf, for picomatch <=4.0.7. As of 2026-11-18, the advisory has no published patched npm version. npm propagates this one advisory through React Native Codegen, Metro, Jest worker, and CLI dependencies, producing 29 high package entries. The lockfile confirms that the affected picomatch copies are used by anymatch, jest-util, micromatch, and tinyglobby, which are build/tooling dependencies and are not packaged into the APK.

The current low finding, GHSA-474x-hrwr-fgx4, is in fast-xml-parser, pulled by React Native CLI Android/Apple configuration tooling. It is non-blocking under the existing high/critical release threshold.

## Enforced exception

scripts/check-mobile-dependency-audit.cjs permits only the exact picomatch advisory above, and only while:
- every high/critical audit entry resolves exclusively to that advisory;
- every affected package name matches the reviewed current dependency graph;
- every direct lockfile parent of picomatch remains in the reviewed build-tool parent list; and
- fast-xml-parser remains confined to the reviewed React Native CLI tooling parents.

Any new advisory, newly affected package, unresolved audit chain, or new runtime parent fails the build. This is not a general npm-audit suppression and must be removed once upstream publishes a patched picomatch version.

Do not use npm audit fix --force: npm's suggested React Native downgrade is incompatible with the project's supported React Native line and is not an acceptable security remediation.
