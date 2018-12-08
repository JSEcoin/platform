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
Check out our live [Platform](https://platform.jsecoin.com).

Our next release that uses this code base can be accessed from - 
[Alpha Release Platform](https://alpha.jsecoin.com).

## Prebuilt binaries
See our [Releases Page](https://github.com/JSEcoin/platform/releases) for Windows binaries.  
Our Linux, IOS release will be coming out shortly..

## Quickstart

1. Install [Node.js](https://nodejs.org) v8.0.0 or higher.
2. Clone this repository: `git clone https://github.com/JSEcoin/platform`
3. Install dependencies `npm install`

## Working with the Desktop App
The app currently supports ia32/x64.  
Linux support will be coming soon.

### Development

1. Initialise developer environment `npm run web:dev`

### Build & Package Binaries

1. Executing `npm run desktop:build` compiles the app within `./dist_electron` and then builds the binaries within `./build`

## Generating the Web Platform

1. Executing `npm run web:build` generates the compiled platform within `./dist`.

## Generating the Mobile App

### Build

#### Packaging and deploying Android binaries

## Generating the style guide
We've started documenting the platform and breaking it down into reusable components.
Head over to the [Platfom StyleGuide](https://jsecoin.com/styleguide) and take a look.

To generate your own styleguide from the source -

### Development

1. Executing `npm run styleguide` Initialises the developer environment

### Build

1. or executing `npm run styleguide:build` will generate the documentation within `./styleguide`

#### Style guide assets
Additional assets are pulled from the `./docs` directory images css etc.

## Bug Bounty
This is an initial push alot of cleanup is still required if you spot an issue please report it and if we consider it a major issue we will credit your account as part of our bug bounty offering.
[Bug Bounty Info Page](https://jsecoin.com/en/oddJobs/bugBounty)

## Contribute
If you'd like to assist and help the team please first review our [Contribution Guidelines](./CONTRIBUTING.md).

## License
This project is under the [GNU General Public License v3.0](./LICENSE.md).
