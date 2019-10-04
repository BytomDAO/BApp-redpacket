# Red Packet Bapp

Official implementation of Red Packet Bapp base on Bytom protocol.

## Table of Contents

1. [Overview](#chapter-001)
2. [Installation](#chapter-002)<br>
  2.1 [Building Dependencies](#chapter-0021)<br>
  2.2 [Building from Source Code](#chapter-0022)<br>
3. [Getting Started](#chapter-003)
4. [Specification](#chapter-004)
5. [Contributing](#chapter-005)
6. [License](#chapter-006)

## Overview <a id="chapter-001"></a>

Red Packet Bapp's goal is to achieve a decentralized application, which is a game for grabbing the red packet. It supports that sending one or more red packets within a transaction, if the multiple red packets are sent in a transaction, the amount of each red packet is randomly generated based on the total amount.

We are developing Red Packet Bapp using the concise and efficient Go programming language. If you run into problems while using Red Packet Bapp, please read the documentation for README, feel free to file an issue in this repository, or hop on our chat room(`WeChat` or `telegram`) to ask a question. We are glad to help.

## Installation <a id="chapter-002"></a>

Red Packet Bapp consists of two parts: the frontend and the backend. The frontend is mainly responsible for the connection with the [byone](https://chrome.google.com/webstore/detail/byone/nlgbhdfgdhgbiamfdfmbikcdghidoadd) chrome extension plugin and the display of the web page, and the backend implementations include the logic processing of red packet functions、the storage of red packet data and the interaction with blockcenter(it's a decentralized wallet for `Bytom`).

### Build Dependencies <a id="chapter-0021"></a>

Red Packet Bapp requires a series of specified software installations to build. If you don't already have these requirements, you should solve it by installing:

- Red Packet Bapp Frontend

  Building requires [Node.js](https://nodejs.org), the needed is that `node` version `11.x.x` and `npm` version `6.x.x`.

  Besides, the [Chrome](https://www.google.com/chrome/) browser is needed, because the Bapp rely on the Bytom chrome plugin wallet [Byone](https://chrome.google.com/webstore/detail/byone/nlgbhdfgdhgbiamfdfmbikcdghidoadd), please install it from [chrome webstore](https://chrome.google.com/webstore/category/extensions?utm_source=chrome-ntp-icon).

- Red Packet Bapp Backend

  Building requires [Go](https://golang.org/doc/install) version `1.8` or higher, with `$GOPATH` set to your preferred directory. Furthermore, the version `5.7` of [Mysql](https://www.mysql.com/) and the latest stable version of [Redis](https://redis.io/) are needed.

### Build from Source Code <a id="chapter-0022"></a>

Download `redpacket` source code
```
$ git clone https://github.com/Bytom/BApp-redpacket.git $GOPATH/src/github.com/redpacket
$ cd redpacket
```

Build the project include two parts:
- Red Packet Bapp Frontend
  
  Install `node.js` related dependencies:
  ```
  npm install
  ```

  Build for production js file with:
  ```
  npm run build
  ```

- Red Packet Bapp Backend

  The target of building backend source code are the `api` and `updater` binaries. The `api` provide the RPC request and response service for users, and the `updater` provide the synchronization services for `blockcenter`(blockcenter is the decentralized wallet server for `bytom`).

  ```bash
  $ cd redpacket-backend
  $ make all
  ```

  This produces an executable in the `./target` subdirectory.

### Getting Started <a id="chapter-003"></a>

The backend service must be started before the frontend service is started, because the frontend rpc call rely on the `api` service of backend.

- Red Packet Bapp Frontend

  startup with run command:
  ```
  npm start
  ```

  Finally, navigate to `http://localhost:8000`.

- Red Packet Bapp Backend

  1）Startup `mysql` and Create database

  Please make sure the mysql service is enabled before create database.

  ```bash
  $ mysql -u root -p < redpacket-backend/database/dump.sql
  ```

  Finally, enter the correct of `root` password that will create database and tables successfully.

  2）Startup `redis`

  startup with run command:
  ```
  redis-server /usr/local/redis.conf
  ```

  So redis server begin running in the background.

  3）Modify config

  the default config file is `scripts/config_local.json`, the configuration instructions are as follows:
  ```js
  {
    "gin-gonic": {
      "listening_port": 3100,   // the port of API service
      "is_release_mode": false  // the release mode of gin-gonic, it's debug mode with false
    },
    "mysql": {
      "master": {
        "host": "127.0.0.1",      // the IP of database server
        "port": 3306,             // the port of database server, default is 3306
        "username": "root",       // the username of server
        "password": "password",   // the password of server
        "database": "redpacket"   // the name of database
      },
      "log_mode": true            // the log mode, true print detailed logs, false only print error logs
    },
    "redis": {
      "endpoint": "127.0.0.1:6379", // the IP and port of redis
      "pool_size": 10,              // the pool size
      "database": 6,                // the category of database
      "password": "password",       // the passwprd
      "cache_seconds": 600,         // the expiration of cache
      "long_cache_hours": 24        // the long expiration of cache
    },
    "api": {
      "mysql_conns": {
        "max_open_conns": 20,   // the max open connects
        "max_idle_conns": 10    // the max idle connects
      }
    },
    "updater": {
      "block_center": {
        "net_type": "btm",      // the network type(btm or vapor)
        "network": "solonet",   // the mainnet network name(mainnet, testnet and solonet)
        "common_guid": "a91cf6bb-184f-40a4-a45d-0e7a4201c23c",  // the common wallet guid(arbitrary walletID for blockcenter)
        "sync_seconds": 60,               // the synchronization interval
        "url": "http://127.0.0.1:3000",   // the url of blockcenter server
        "mysql_conns": {
          "max_open_conns": 5,    // the max open connects
          "max_idle_conns": 5     // the max idle connects
        }
      }
    }
  }
  ```

  4）Startup service

  To start Red Packet Bapp Backend manually, just run:

  ```bash
  $ ./target/api ../scripts/config_local.json

  $ ./target/updater ../scripts/config_local.json
  ```

## Specification <a id="chapter-004"></a>

In terms of use and build the Red Packet project,  please read the related [RPC documents](redpacket-backend/docs/rpc.md).

## Contributing <a id="chapter-005"></a>

Feel free to dive in! [Open an issue](https://github.com/Bytom/redpacket/issues/new) or submit PRs.

### Contributors <a id="chapter-006"></a>

This project exists thanks to all the people who contribute. 
- [oysheng](https://github.com/oysheng/)
- [Zhiting Lin](https://github.com/ZhitingLin/)

## License <a id="chapter-001"></a>

[MIT](LICENSE) © BYTOM# BApp-redpacket
