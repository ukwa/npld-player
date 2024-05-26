# npld-player

Secured browser for accessing NPLD content in Legal Deposit Library reading rooms.

## Deployment

The steps to generate a new, tagged npld-player build are:

* On a machine with X11 running (as DISPLAY needs to be set) and with this repo up to date, fully commited etc.,
  * Copy ```sample.env``` to ```.env``` and configure the environment variables

  * ``` yarn && yarn start ```
    * This pulls in lots of dependencies and builds packages

  * ``` npm version prerelease ```
    * This increments the code number to a new release version

  * ``` git push ```
    * This pushes the release version and the corresponding tag/s

* Log into https://github.com/ukwa/npld-player
  * Create a new release tag

* Log into https://github.com/ukwa/npld-player-builds
  * Go to github Actions Workflows and instigate 'Build' from main branch, which should result in a new npld-player build

## Deployment

This product is only intended to be deployed by Legal Deposit libraries.  Binaries are not publicly available, but staff can get in touch with UKWA staff to be given access to the https://github.com/ukwa/npld-player-builds project where those binaries can be accessed.




### Icon generation

``` convert icons/ld-player.png -define icon:auto-resize=256,128,64,48,32,16 icons/ld-player.ico ```

### Configuration Management

Note that the values of the configuration variables are are baked-in at build time using the [EnvironmentPlugin](https://webpack.js.org/plugins/environment-plugin/). This is necessary for the authentication token as we don't want it to be accessible as an environment variable when deployed in reading rooms.

Where needed, environment variables can be overridden at runtime, but note that each variable needs to be specified explicitly in the code in order to allow this to happen.

### Installation

After the installation, it is necessary to set up some environment variables so the Player knows which service to talk to.  For example, for the BL Staff Alpha service, we use the `blstaff-alpha.ldls.org.uk` domain.  To set up the NPLD Player to use this domain, set:

```
NPLD_PLAYER_PREFIX=https://blstaff-alpha.ldls.org.uk/
```

To point to a specific starting page (e.g. a test page) an additional variable is needed:

```
NPLD_PLAYER_PREFIX=https://blstaff-alpha.ldls.org.uk/
NPLD_PLAYER_INITIAL_WEB_ADDRESS=https://blstaff-alpha.ldls.org.uk/test_alpha.html
```

Note that the `NPLD_PLAYER_PREFIX` defines the URLs that the NPLD Player will render. Any URLs outside that scope get passed to the user's default desktop browser.

_TBC:_ The `NPLD_PLAYER_ENABLE_PRINT` variable can also be set to `true` or `false` depending on whether printing is desired.

