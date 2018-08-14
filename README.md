<center>
     <img src="docs/public/img/Collage.png" width="100%">
</center>

# Cisco UI kit

The Cisco UI kit and pattern library is a style guide governing HTML markup at the presentation layer. It contains no javascript components. Instead, it focuses on HTML and CSS and leaves the choice of javascript toolkit up to the individual development teams.

This library is a collaboration between Cisco Brand and Cisco Engineering

## Copyright and License

Code and documentation copyright 2018 Cisco Systems.

---

# Building the UI Kit

Before you can build the UI Kit you will need to install a few tools.

#### 1. Node - Download the latest (at least 5.11) version for your platform [here](https://nodejs.org/en/download/)

#### 2. Git - Download the latest (at least 2.5.x) client [here](https://git-scm.com/downloads)

#### 3. Next install gulp via the node package manager (npm). You may need root access on your box to run this command.
```sh
$ npm install --global gulp-cli
```

NOTE: If you are using Windows 10 make sure to grab gitbash [here](https://git-for-windows.github.io/)

#### 4.1 There are several ways to get the source. Create a folder and clone the UI Kit source from Github like this:
```sh
$ mkdir cui
$ cd cui
$ git clone https://github.com/CiscoDevNet/CiscoUIKit.git .
```

NOTE: You will want to work on a feature branch (not master!). To create a feature branch called `foo` run this:
```sh
$ git checkout -b foo origin/master
```

#### 4.2 Or you can fetch the UI Kit source from Git via NPM like this:
in your package.json file add this line to the dependencies section:
```
"cisco-ui": "git+https://github.com/CiscoDevNet/CiscoUIKit.git#v1.1.0-official"
```
or from your command-line run:
```
npm install git+https://github.com/CiscoDevNet/CiscoUIKit.git#v1.1.0-official --save
```

#### 4.3 Or you can fetch the UI Kit source from Git via Bower like this:
in your bower.json file add this line to the dependencies section:
```
"cisco-ui": "https://github.com/CiscoDevNet/CiscoUIKit.git#v1.1.0-official"
```

#### 4.4 Or you can fetch the UI Kit source from Git via Yarn like this:
From the command-line run:
```
yarn add git+https://github.com/CiscoDevNet/CiscoUIKit.git#v1.1.0-official
```

NOTE: We use a common naming syntax like this v.{version}-official

#### 5. Install the node modules
```sh
$ npm install
```

#### 6. Build the UI Kit
```sh
$ npm run build
```

#### 7. Open the UI Kit in your browser. In your browser of choice select File -> Open and choose build/docs/index.html
