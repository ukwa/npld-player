# npld-player

Secured browser for accessing NPLD content in Legal Deposit Library reading rooms.

## Deployment

The steps to generate a new, tagged npld-player build are:

* On a machine with X11 running (as DISPLAY needs to be set) and with this repo up to date, fully commited etc.,
  * Clone the ```npld-player``` repo to ensure no residual content from previous usage

  * Copy ```sample.env``` to ```.env``` - NO CHANGES are required at this stage

  * ``` yarn && yarn start ```
    * This pulls in lots of dependencies and builds packages

  * ``` npm version prerelease ```
    * This increments the code number to a new release version and updates the `package.json` file with the build details

  * ``` git push ```
    * This pushes the release version and the corresponding tag/s

* Log into https://github.com/ukwa/npld-player
  * Create a new release tag


## Deployment

This product is only intended to be deployed by Legal Deposit libraries.  Binaries are not publicly available, but staff can get in touch with UKWA staff to be given access to the https://github.com/ukwa/npld-player-builds project where those binaries can be accessed.



### Installation

After the installation, it is necessary to set up some environment variables so the Player knows which service to talk to.  To set up the NPLD Player to use a specific sub-domain, set:

```
NPLD_PLAYER_PREFIX=https://(sub-domain).ldls.org.uk/
```

To point to a specific starting page (e.g. a test page) an additional variable is needed:

```
NPLD_PLAYER_PREFIX=https://(sub-domain).ldls.org.uk/
NPLD_PLAYER_INITIAL_WEB_ADDRESS=https://(sub-domain).ldls.org.uk/(dir/)?(web page, e.g., index.html)
```

Note that the `NPLD_PLAYER_PREFIX` defines the URLs that the NPLD Player will render. Any URLs outside that scope get passed to the user's default desktop browser.

