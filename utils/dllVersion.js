var fs = require('fs');

function getModuleVersion(dependency) {
  var NODE_MODULES = '/node_modules/';
  var dp = require.resolve(dependency);
  var pkgPath = dp.substring(0, dp.lastIndexOf(NODE_MODULES)) + NODE_MODULES + dependency + '/package.json';
  var pkg = require(pkgPath);
  return pkg.version;
}

function getCurrentVersion(dependencies) {
  var disable = false;
  var result = {};
  dependencies.forEach(function (dependency) {
    if (dependency.indexOf('/') >= 0) {
      disable = true;
    } else {
      result[dependency] = getModuleVersion(dependency);
    }
  });
  return !disable && result;
}

function getVersionFilePath(dllPath, name) {
  return dllPath + '/' + name + '.version.json';
}

function getOldVersion(dllPath, name) {
  var versionPath = getVersionFilePath(dllPath, name);
  if (fs.existsSync(versionPath)) {
    return require(versionPath);
  }
  return null;
}

exports.record = function (dllPath, chunk) {
  var name = chunk.name;
  var dependencies = chunk.dependencies;
  var currentVersions = getCurrentVersion(dependencies);
  var versionPath = getVersionFilePath(dllPath, name);
  fs.writeFileSync(versionPath, JSON.stringify(currentVersions));
};

exports.isExpired = function (dllPath, chunk) {
  var name = chunk.name;
  var dependencies = chunk.dependencies;
  var currentVersions = getCurrentVersion(dependencies);
  var oldVersions = getOldVersion(dllPath, name);
  return !currentVersions ||
    !oldVersions ||
    Object.keys(currentVersions).some(function (key) {
      return currentVersions[key] !== oldVersions[key];
    }) ||
    (Object.keys(currentVersions).length !== Object.keys(oldVersions).length);
};
