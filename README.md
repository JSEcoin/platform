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
- Currently this is just a snaphot of the desktop environment but will become responsive to match the design above.

## Prebuilt binaries
See our [Releases Page](https://github.com/JSEcoin/platform/releases) for Windows binaries.  
Our Mac, Linux, IOS and Android release will be coming out shortly

## Quickstart

1. Install [Node.js](https://nodejs.org) v8.0.0 or higher.
2. Clone this repository: `git clone https://github.com/JSEcoin/platform`
3. Install dependencies `npm install`

## Working with the Desktop App
The app currently supports ia32/x64.  
Mac and Linux support will be coming soon.

### Development

1. Initialise developer environment `npm run desktop:dev`

### Build & Package Binaries

1. Executing `npm run desktop` compiles the app within `./dist/desktop` and then builds the binaries within `./build`

#### WARNING
There is a known bug when building Desktop NSIS Binaries with x64 and ia32 bit support.
This will cause the app to freeze.  
If you do generate a build please edit the `./package.json` file.  
And remove the target that you don't need.  

```json
{
  "win": {
    "icon": "build/icons/icon.ico",
    "target": [
      {
        "target": "nsis",
        "arch": [
          "x64"
        ]
      },
      {
        "target": "nsis",
        "arch": [
          "ia32"
        ]
      }
    ]
  }
}
```


## Generating the Web Platform
Currently this is a snapshot of the desktop app - you can access it [here](https://alpha.jsecoin.com). 
We will be updating this project and making the app responsive to support our plans for the advanced platform layout.

1. Executing `npm run web` generates the compiled platform within `./dist/web`.

## Generating the Mobile App
We are actively working on this...  
If you try this out - Expect there to be sea krakens and unknown objects lurking in the deep ;).. 

### Build

1. Executing `npm run mobile` will compile the platform into `./build/mobile/www/` and will not build the apk.
2. Executing `npm run mobile:android` will compile the platform app into `./build/mobile/www/` - build the apk and deploy to android vm or device if attached.

#### Packaging and deploying Android binaries
To build an android apk you will need to first setup cordova.  
First make sure you have the following required components setup - [Cordova Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#requirements-and-support)

- Now setup and install cordova

```bash
npm install -g cordova
cd ./build/mobile/
npm install
cordova add android
```


<!--
### Development

1. Initialise developer environment `npm run mobile:dev`

### Package - Cordova

1. Executing `npm run mobile:cordova` will compile the mobile app into `./dist/mobile` and create mobile binaries.
*Currently just for Android*

### Package - Cordova:Browser

1. Executing `npm run mobile:browser` will compile the mobile app into `./dist/mobile` and create mobile browser edition

### Package - Cordova:android

1. Executing `npm run mobile:android` will compile the mobile app into `./dist/mobile` and will build and deploy to a connected android device.

### Package - Cordova:android-VM

1. Executing `npm run mobile:android-vm` will compile the mobile app into `./dist/mobile` and launch deploy to an android Virtual Machine if this has been setup.
-->

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
