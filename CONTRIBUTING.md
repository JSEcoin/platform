<div align="center">

![JSECoin Ltd](https://jsecoin.com/docs/images/JSECoin_logo.png)
</div>

# Contributions

Development contributions, bug submissions and peer-review is welcomed by the JSEcoin project. 

For security related bugs please check our bug bounty program: 
[https://jsecoin.com/en/oddJobs/bugBounty](https://jsecoin.com/en/oddJobs/bugBounty)

## What should I know before I get started?

JSEcoin is a large open source project that is broken down in to the following repositories:-

- Website - This is the vue.js website at https://jsecoin.com
- Platform - The client side code is contained in a single repository which is used to build out the web platform, desktop app and mobile apps. 
- Server - This repository contains the JSE node that runs the p2p network, a custom datastore and a controller which - times blockchain functions and carries out maintenance.
- Contract - Contains the ERC20/223 Ethereum Smart Contract

With the exception of the ERC20 contract which is written in solidity the rest of the code base is Javascript. The server side code runs on node.js, clients are built out using Electron for the desktop app and Cordova for the mobile apps. We believe in Javascript everywhere as this makes it easier to bridge components and for all core developers and external contributors to work with the source code.

## Why Get Involved?

- Working on an open source blockchain project is a great way to learn and grow as a developer
- Meet people who are interested in blockchain technologies
- As holders of tokens we are all stakeholders in the project
- Grow your reputation as a developer, designer, bug bounty hunter
- Learn people skills, this industry brings the best and worst out in people
- It is empowering to be able to make changes, even small ones and see them in production.
Code of Conduct

It’s 2018 and the JSEcoin team does not care what you look like, your ethnicity, sex, religion or anything else that is irrelevant to your ability to help the project. For those who write great code, we will love you all the same. Trolling and abuse to our community will not be tolerated. Play nice and support each other.

## How Can I Contribute?
### Reporting Bugs

Before creating bug reports, please check the current issues at:

- [https://github.com/JSEcoin/server/issues](https://github.com/JSEcoin/server/issues)
- [https://github.com/JSEcoin/platform/issues](https://github.com/JSEcoin/platform/issues)
- [https://github.com/JSEcoin/website/issues](https://github.com/JSEcoin/website/issues)
- [https://github.com/JSEcoin/contract/issues](https://github.com/JSEcoin/contract/issues)

### To ensure it hasn’t been submitted before.

Please include as much detail as possible in your reports and most importantly explain the steps required for our team to reproduce the problem.

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you've determined which repository from the list above your bug is related to, create an issue on that repository and provide the following information by filling in a submission.

- Explain the problem and include additional details to help maintainers reproduce the problem:
- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem 
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why.
- Include screenshots if possible
- If appropriate include the browser and operating system you are using

### Suggesting Enhancements

You can either make suggestions for the code base using GitHub or you can contact us directly here: 

[https://jsecoin.com/en/support/contact/](https://jsecoin.com/en/support/contact/)

Please don’t hold back if there’s something we could be doing better then let us know. Our team will not be offended and at the end of the day we all want what is best for the project.

### Your First Code Contribution

Code can be contributed to the project by forking a repository, creating a branch and then opening a pull request.

1. Fork the repository and clone it locally. GitKraken is a great tool for working with github but you can do it via the command line as well.
2. Create a branch for your edits.
3. Run eslint on any code contributions. This helps find minor bugs and keep the code standard when working with multiple contributors. Is the code of a similar style to the existing code? Make it as good as possible and stick to styleguides where possible. This may mean using indents, semi-colons or comments differently than you would in your own repository, but makes it easier for the maintainer to merge, others to understand and maintain in the future.
4. Use descriptive commit messages and titles, something we need to work on internally as well!
5. Submit a pull request for the modified code. Include as much information as possible when doing this.
6. Core developers may merge the pull request in once the code has been checked. Please bare in mind that this is a financial network and our developers need to be sure that any code added is secure and adds value to the project.

*Thank you for being a part of the JSEcoin open source community*
