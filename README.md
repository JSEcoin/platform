# JSE Platform

**[JSECOIN](https://jsecoin.com/)** [THE FUTURE BLOCKCHAIN & ECOSYSTEM FOR ECOMMERCE AND DIGITAL ADVERTISING]

<div align="center">

![JSECoin Ltd](https://jsecoin.com/docs/images/JSECoin_split_desktop_browser_small.png)
</div>


## Resources

- [White Paper](https://jsecoin.com/whitepaper.pdf): Introduction to JSECoin Project.
- [Platfom StyleGuide](https://jsecoin.com/styleguide): Reusable Platform Components overview.
- [API Documentation](https://developer.jsecoin.com/API): API Reference and Sample code.

## Demo
Check out our live [Platform](https://platform.jsecoin.com).

Our next release that uses this code base can be accessed from - 
[Alpha Release Platform](https://alpha.jsecoin.com).
- Currently this is just a snaphot of the desktop environment but will become responsive to match the design above.

## Prebuilt binaries
See our [Downloads page](https://jsecoin.com/downloads) for Windows binaries.
Our Mac, Linux, IOS and Android release will be coming out shortly

## Quickstart

1. Install [Node.js](https://nodejs.org) v8.0.0 or higher.
2. Clone this repository: `git clone https://github.com/JSEcoin/platform`
3. Install dependencies `npm install`

## Working with the Desktop App
When building the app support has been setup for ia32/x64 Mac and Linux support will be coming shortly.

### Development

1. Initialise developer environment `npm run desktop:dev`

### Build & Package Binaries

1. Executing `npm run desktop` compiles the app within `./dist/desktop` and then builds the binaries within `./build`

## Generating the Web Platform
Currently this is a snapshot of the desktop app - you can access it [here](https://alpha.jsecoin.com). 
We will be updating this project and making the app responsive to support our plans for the advanced platform layout.

1. Executing `npm run web` generates the compiled platform within `./dist/web`.

## Generating the mobile Platform
We are actively working on this... 

### Development

1. Initialise developer environment `npm run mobile:dev`

### Build

1. Executing `npm run mobile` will compile the mobile app into `./dist/mobile`.

### Package - Cordova

1. Executing `npm run mobile:cordova` will compile the mobile app into `./dist/mobile` and create mobile binaries.
*Currently just for Android*

### Package - Cordova:Browser

1. Executing `npm run mobile:browser` will compile the mobile app into `./dist/mobile` and create mobile browser edition

### Package - Cordova:android

1. Executing `npm run mobile:android` will compile the mobile app into `./dist/mobile` and will build and deploy to a connected android device.

### Package - Cordova:android-VM

1. Executing `npm run mobile:android-vm` will compile the mobile app into `./dist/mobile` and launch deploy to an android Virtual Machine if this has been setup.

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
