var execSync = require('child_process').execSync;
var opn = require('opn');

// https://github.com/sindresorhus/opn#app
var OSX_CHROME = 'google chrome';

function openBrowser(url) {
  // Attempt to honor this environment variable.
  // It is specific to the operating system.
  // See https://github.com/sindresorhus/opn#app for documentation.
  const browser = process.env.BROWSER;

  // Special case: BROWSER="none" will prevent opening completely.
  if (browser === 'none') {
    return false;
  }

  // If we're on OS X, the user hasn't specifically
  // requested a different browser, we can try opening
  // Chrome with AppleScript. This lets us reuse an
  // existing tab when possible instead of creating a new one.
  const shouldTryOpenChromeWithAppleScript = (
    process.platform === 'darwin' && (
      typeof browser !== 'string' ||
      browser === OSX_CHROME
    )
  );

  if (shouldTryOpenChromeWithAppleScript) {
    try {
      // Try our best to reuse existing tab
      // on OS X Google Chrome with AppleScript
      execSync('ps cax | grep "Google Chrome"');
      execSync(
        'osascript openChrome.applescript ' + url,
        { cwd: __dirname, stdio: 'ignore' }
      );
      return true;
    } catch (err) {
      // Ignore errors.
    }
  }

  // Fallback to opn
  // (It will always open new tab)
  try {
    var options = { app: browser };
    opn(url, options).catch(() => { }); // Prevent `unhandledRejection` error.
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = openBrowser;
