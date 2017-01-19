# solidity-example-crowdfunding

An example Ethereum Smart Contract with Solidity

## Setup

* `docker pull harshjv/testrpc`
* `docker run -d -p 8545:8545 harshjv/testrpc`
* open index.html

To build locally, you might also use:

* `docker pull mzupzup/soliditybuilder`
* `docker run -v /path/to/this/folder:/sol mzupzup/soliditybuilder`
  * windows: `docker run -v c:/path/to/this/folder:/sol mzupzup/soliditybuilder`

If you want automatic file-watching as well (not on Windows), you may also use:

* `docker pull mzupzup/soliditywatcher`
* `docker run -v /path/to/this/folder:/sol mzupzup/soliditywatcher`

## The Contract

**Winner Takes all Crowdfunding**

* Create contract with minimum entry fee, deadline for project proposals and deadline for campaign
* People can enter their projects with a name, url and the entry fee until the project proposal deadline 
* After project proposal deadline, other people can "vote" with ether for the projects they want to support until the campaign deadline
* When the proposal deadline is reached, the campaign can be finished and the Project with the most funds overall receives all the funds entered in the campaign

