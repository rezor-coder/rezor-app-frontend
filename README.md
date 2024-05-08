
## SaitaPro Wallet
Welcome to SaitaPro Wallet ! It is a non-custodial wallet or decentralized wallet, it is a type of cryptocurrency wallet that gives users complete control over their private keys and funds on Blockchain.
This repository contains all the code for the **SaitaPro Wallet** React Native app. 


## Prerequisites
* Xcode 14.2 or higher - install from [App Store](https://apps.apple.com/gb/app/xcode/id497799835?mt=12)
* Android Studio - install [here](https://developer.android.com/studio)
* Homebrew - install [here](https://brew.sh/)
* Node Version Manager (nvm) - install [here](https://github.com/nvm-sh/nvm/blob/master/README.md#installing-and-updating)
* Ruby (use Homebrew to install) - guide [here](https://formulae.brew.sh/formula/ruby)
* Gradle (use Homebrew to install) - guide [here](https://formulae.brew.sh/formula/gradle)

## Setup
1. Clone the repository: `git clone https://github.com/your-username/SaitaPro-frontend.git`
2. Install nvm
3. Run `nvm use` at the base of this repository
4. Run `npm install` to install the dependencies

### iOS

1. Run `cd ios` to change to the iOS directory
2. Run `pod install` to install the CocoaPods dependencies
3. Run `cd ..` to return to the base of the directory
4. Run `npm start`
5. Run `npx react-native run-ios --simulator "iPhone 14 Pro"` (you may need to open a new terminal window) and the Simulator will launch running the SaitaPro Wallet 🎉

### Cocoapods (iOS Only)

If you're building the iOS version of the app, you'll need Cocoapods to manage the native iOS dependencies. Follow these steps to install Cocoapods if it's not already installed:

1. Open your terminal.
2. Run the following command to install Cocoapods:

   ```shell
   gem install cocoapods

Wait for the installation to complete. Once it's done, you can proceed with the iOS setup steps mentioned above.

## Feature

Once you have the application running, you can perform the following actions:

+ **Create a new wallet**: Generate a new wallet address and private key pair.

+ **Import an existing wallet**: Import an existing wallet using a mnemonic phrase or private key.

+ **Send and receive cryptocurrencies**: Send and receive various cryptocurrencies securely.

+ **View transaction history**: Track your transaction history conveniently within the application.


## Technologies Used

In this project we have used following technologies:

+ React.js
+ React-native
+ Redux.js

## Folder Structure

```md
SaitaPro_frontend

|--ABI # this folder abis for contracts
|--android # this folder contains android native files
|--assets 
|   |-- fonts # this folder contains font files
|   |-- images # this folder contains common icons and dark and white icons folder
|  |   |-- iconDark # this folder contains icons for dark theme
|   |   |-- iconWhite  # this folder contains icons for light theme
|--ios # this folder contains iOS native files
|--src
|   |-- Api # this folder contains common api calls file
|   |-- Components
|   |   |-- Screens # this folder contains screens classes
|   |   |-- common # this folder contains common components
|   |-- Redux 
|   |   |-- Actions # this folder contains redux action classes used for data management
|   |   |-- Reducers # this folder contains redux reducer classes used for data management
|   |-- Utils # contains uitlity files like wallet connect common methods, theme common methods and multisender abis
|   |-- theme # this folder contains common classes for fonts, colors and images
|   |-- App.js # root class of the project
|   |-- Router.js # navigation center
|   |-- Constants.js # this file common keys and text phrases 
|   |-- Singleton.js # this class contains common methods and values used inside project
|   |-- utils.js # this class contains common methods and values used inside project
|   |-- Endpoints.js # this file contains api endpoints
ThemeManager.js # theme and language manager class.
```



