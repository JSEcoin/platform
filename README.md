# JSE Platform

**[JSECOIN](https://jsecoin.com/)** [THE FUTURE BLOCKCHAIN & ECOSYSTEM FOR ECOMMERCE AND DIGITAL ADVERTISING]

<div align="center">

![JSECoin Ltd](https://jsecoin.com/docs/images/JSECoin_split_desktop_browser_small.png)

[![Twitter](https://img.shields.io/twitter/url/https/github.com/JSEcoin/platform.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FJSEcoin%2Fplatform)

[![GitHub license](https://img.shields.io/github/license/JSEcoin/platform.svg)](https://github.com/JSEcoin/platform/blob/master/LICENSE)

</div>


## Resources

- [White Paper](https://jsecoin.com/whitepaper.pdf): Introduction to JSECoin Project.
- [Platfom StyleGuide](https://jsecoin.com/styleguide): Reusable Platform Components overview.
- [API Documentation](https://developer.jsecoin.com/API): API Reference and Sample code.

## Demo
- Check out our live [Platform](https://platform.jsecoin.com).

- Our next release that uses this code base can be accessed from - 
[Alpha Release Platform](https://alpha.jsecoin.com).

## Prebuilt binaries
See our [Releases Page](https://github.com/JSEcoin/platform/releases) for our app binaries.  
Our Linux, release will be coming out shortly..


---
---


## Quickstart

1. Install [Node.js](https://nodejs.org) v10.6.0 or higher.
2. Clone this repository: `git clone https://github.com/JSEcoin/platform`
3. Install dependencies `npm install`

_You can launch vue ui and import this project or run the npm commands listed below_

## Available App Builds

The app currently supports:

- Windows (ia32/x64)
- Mac OS
- Web (PWA)
- Android
- IOS

_Linux support will be coming soon._

### Development

If you are interested in contributing to the JSEcoin Project you can start up the developer environments with the following commands:

```bash
######
# Initialise Developer Environments
######
# WEB
npm run web:dev
# DESKTOP
npm run desktop:dev
# ANDROID
npm run mobile:android:dev
# IOS
npm run mobile:ios:dev
# STYLEGUIDE DOCS
npm run styleguide:dev
```

#### Mobile info

When running the mobile app in dev mode this will start a local webserver on your machine.
The mobile app will try to connect to this; this allows for faster testing and development on the mobile platform so you won't need to rebuild and test.
chrome://inspect will allow you to inspect any errors from google on your desktop.

Make sure to update the script in the header with your local IP - 
```
src\index.html
```

### Build & Package Binaries

If you would like to build out and test the latest edition of the platform you can use the following commands - 
_beware only the master branch contains the latest stable binary builds!_

```bash
######
# Build
######
# WEB - ./dist_web
npm run web:build
# DESKTOP - ./dist_desktop
npm run desktop:build
# ANDROID
npm run mobile:android:build
# IOS
npm run mobile:ios:build
# STYLEGUIDE DOCS - ./dist_styleguide
npm run styleguide:build
```

---
---


## Bug Bounty
This is an initial push alot of cleanup is still required if you spot an issue please report it and if we consider it a major issue we will credit your account as part of our bug bounty offering.
[Bug Bounty Info Page](https://jsecoin.com/en/oddJobs/bugBounty)

## Contribute
If you'd like to assist and help the team please first review our [Contribution Guidelines](./CONTRIBUTING.md).

## License
This project is under the [GNU General Public License v3.0](./LICENSE.md).
