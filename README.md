# Novo Web CLI

**Novo Web CLI** is an experimental, dockerized web app that simplifies interactions with the Novo node, providing an easy-to-use interface for users.

[novoappscreen](https://user-images.githubusercontent.com/131675747/235297176-ff47babd-d60f-4401-8625-a5da24a20f63.png)

## Features!

- User-friendly interface for managing Novo node operations
- Supports both fungible token (FT) and non-fungible token (NFT) operations
- List and display FT and NFT assets with detailed information
- Designed for learning about blockchain technology and node software
- Easily issue new tokens and manage existing ones
- Accessible via a web browser at http://localhost:3000/


## Prerequisites

- Docker must be installed on your system


## Getting Started

To start using Novo Web CLI, follow these steps:

1. Clone the repository:

```git clone https://github.com/NovoMinersClub/novo-webcli/```


2. Change to the project directory:

```cd novo-webcli```


3. Run the `run.sh` script with sudo privileges:

```sudo bash run.sh```



Please note that building the Docker container may take some time (~30 minutes). Once the build process is complete, the application will be up and running in a Docker container, and accessible via your web browser at http://localhost:3000/.

## To-Do / Ideas

- Correct the bad display of some data related to tokens and NFTs
- Improve design
- Implement a UTXO index 
- Implement a "Search UTXO" page that allows to explore the UTXO index
- Implement a "Contracts" page that displays data related to a given contractID (holders, distributions, last transactions, ...)
- Implement a "Data Storage" page that allows to store data (files, images, tweets, ..) on chain and facilitate the creation of NFTs
- Improve the display of NFT-related data by, for example, converting metadata into images
- Implement a chat on chain with an encryption option
- Improve error handling and user feedback
- Implement multi-signature wallet support
- Add support for smart contracts
- ?


## Contributions

Anyone is welcome to copy, enhance, or contribute to this code. Feel free to create a fork of the repository, make changes, and submit a pull request for review.


## Disclaimer

Miners are not devs and this application has been mostly developed using ChatGPT. It is experimental and for educational purposes only. Users are advised to exercise caution when using this software and to keep a secure copy of their private keys in a safe location. The developer of this application cannot be held responsible for any consequences resulting from the use of this software.

The maintainer of this application and the Novo Miners Club have no direct relationship with the creators of the NOVO blockchain. Neither party encourages investment in this experimental blockchain. The purpose of this application is to provide a tool for community members interested in playing with the node software and learning about the technology.


## Donations

NOVO wallet ```1Gj4Zncv8bcE9Ji5pDkVy9NU3NTQ7Q7U3S```
