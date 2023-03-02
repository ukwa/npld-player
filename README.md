# npld-player

Secured browser for accessing NPLD content in Legal Deposit Library reading rooms.

## Development

### Quickstart

Copy environment variables:

```sh
cp sample.env .env
```

Install and run app locally:

```sh
yarn && yarn start
```

## Deployment

This product is only intended to be deployed by Legal Deposit libraries.  Binaries are not publicly available, but staff can get in touch with UKWA staff to be given access to the https://github.com/ukwa/npld-player-builds project where those binaries can be accessed.

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