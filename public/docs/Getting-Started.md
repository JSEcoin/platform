<div align="center">
<br>
<img width="500" src="/docs/images/jseLogo_card.png" alt="JSECoin Ltd">
<br>
<br>
</div>
<div align="center">

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com) [![forthebadge](http://forthebadge.com/images/badges/uses-js.svg)](http://forthebadge.com) [![forthebadge](http://forthebadge.com/images/badges/makes-people-smile.svg)](http://forthebadge.com)
</div>
<br>
<br>



Our ambition is to create an energy efficient cryptocurrency mined by webmasters which is adopted globally by mainstream users.

All major cryptocurrencies currently rely on miners to carry out the cryptography hashing. Hashing is a mathematical equation that is carried out at large scale to secure a blockchain which is the underlying transaction database of a cryptocurrency. This process consumes huge amounts of computing power and electricity and is dominated by server farms. Miners are rewarded for their efforts by the distribution of the currency.

It is possible to carry out SHA256 and other encryption in a standard web browser or on a mobile device. By embedding a javascript snippet on a website all visitors to the website could carry out the hashing encryption process, which when combined at scale could​ ​replace​ ​the role​ ​of​ ​the​ ​miners​. Website owners would then be rewarded by the distribution of the currency. We have estimated 1 in 15 people either own or have access to a website which provides a large distribution and potential client base.

By using surplus CPU power, huge energy and cost savings could be made over traditional cryptocurrency networks.

As part of this we also offer the ability for users without website to mine JSEcoin. They can do this by accessing the JSEcoin platform and act as miners through either a Web Browser, Desktop or Mobile App. 

We have now Open Sourced the JSEcoin Project and you can explore our code and repositorys [here](https://github.com/jsecoin).


## The Platform

This documentation covers the components used to generate the front end platform user interface designed for Desktop Mobile and Web - built with [VueJS](https://vuejs.org/) ontop of [Electron](https://http://electron.atom.io) for Desktop and [Cordova](https://cordova.apache.org/) for Mobile applications.


### Getting Started

The use of `node@^7` or higher is required. 

Download and extract this project into a folder.

```bash
# Install project dependancies
cd JSECoin-platform
npm install
```

#### Web

```bash
# Run web app in dev mode
npm run webdev
# Compile web app
npm run web
```

We are still heavily working on this and adding full browser support.
In the meantime head over to [The JSEcoin Platform](https://platform.jsecoin.com) to take a look at our original project.

#### Mobile

We are actively working on our new Mobile Platform release 
\* - which will become an extension to this document.

Initial support will only be made for Android devices until after the ICO.

#### Desktop

```bash
# Run desktop app in dev mode
npm run dev
# Compile desktop app
npm run build
```

We will be releasing Mac and Linux builds shortly and are currently in the process of testing support before release.

#### Documentation

```bash
# Run documentation in dev mode
npm run styleguide
# Compile documentation
npm run styleguide:build
```

Please make sure you add JSDocs formatting to components if you wish to contribute to the project - to test out your documentation you can use the above commands.

