import React, { useState, useEffect } from 'react';
import { ethers, BigNumber }  from 'ethers';
import './App.css';

// 你需要提供 BuyMyRoom 和 MyToken 合约的 ABI
const BuyMyRoomABI =  [
  {
    "inputs": [
      {
        "internalType": "contract ERC20",
        "name": "_paymentToken",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "ERC721EnumerableForbiddenBatchMint",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721IncorrectOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721InsufficientApproval",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidOperator",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721NonexistentToken",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "ERC721OutOfBoundsIndex",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "HouseListed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "HouseSold",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "etherAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenAmount",
        "type": "uint256"
      }
    ],
    "name": "TokensExchanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "buyHouseWithEther",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "buyHouseWithTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "delistHouse",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "exchangeEtherForTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeRecipient",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getPlatformInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "userEthBalance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "userTokenBalance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "feePercent",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "exchangeRate",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "houses",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isForSale",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "listedTimestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "listHouseForSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "listingFeePercent",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "mintHouse",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paymentToken",
    "outputs": [
      {
        "internalType": "contract ERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_recipient",
        "type": "address"
      }
    ],
    "name": "setFeeRecipient",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_percent",
        "type": "uint256"
      }
    ],
    "name": "setListingFeePercent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "rate",
        "type": "uint256"
      }
    ],
    "name": "setTokenExchangeRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenByIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenExchangeRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const TokenABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "initialSupply",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "allowance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSpender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const BUY_MY_ROOM_CONTRACT_ADDRESS = '0x5323B950ED150e8013d6D861aACB454d02D7Fe69'; // 替换为实际地址
const TOKEN_CONTRACT_ADDRESS = '0xbfD84DB4D21Bbe4Ae0a4b6341F7629EC964739e8'; // 替换为实际地址

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [buyMyRoomContract, setBuyMyRoomContract] = useState<ethers.Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [listingFee, setListingFee] = useState<string>('0');
  const [tokenExchangeRate, setTokenExchangeRate] = useState<string>('0');
  const [properties, setProperties] = useState<any[]>([]);
  const [saleProperties, setSaleProperties] = useState<any[]>([]);
  const [newPrice, setNewPrice] = useState<string>('');
  const [ethToExchange, setEthToExchange] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [updatedFee, setUpdatedFee] = useState<string>('');
  const [updatedExchangeRate, setUpdatedExchangeRate] = useState<string>('');
  const [dialogVisible, setDialogVisible] = useState<string | null>(null);
  const [viewedProperties, setViewedProperties] = useState<boolean>(false);
  const [viewedSaleProperties, setViewedSaleProperties] = useState<boolean>(false);
  const [isDeployer, setIsDeployer] = useState<boolean>(false);
  const [mintAmount, setMintAmount] = useState<string>('0');
  const [mintToAddress, setMintToAddress] = useState<string>('');
  const [newHouseOwner, setNewHouseOwner] = useState<string>('');
  const [authorizationAmount, setAuthorizationAmount] = useState<string>('1000000'); // 初始授权量



  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const buyMyRoomContract = new ethers.Contract(BUY_MY_ROOM_CONTRACT_ADDRESS, BuyMyRoomABI, signer);
        const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TokenABI, signer);

        setBuyMyRoomContract(buyMyRoomContract);
        setTokenContract(tokenContract);

        const ethBalance = await provider.getBalance(accounts[0]);
        setEthBalance(ethers.utils.formatEther(ethBalance));

        const tokenBalance = await tokenContract.balanceOf(accounts[0]);
        setTokenBalance(ethers.utils.formatUnits(tokenBalance, 18));

        const fee = await buyMyRoomContract.listingFeePercent();
        setListingFee(fee.toString());

        const exchangeRate = await buyMyRoomContract.tokenExchangeRate();
        setTokenExchangeRate(exchangeRate.toString());

        const contractOwner = await buyMyRoomContract.feeRecipient();
        setIsAdmin(contractOwner.toLowerCase() === accounts[0].toLowerCase());

        // 判断当前用户是否为部署者
        const deployerAddress = await buyMyRoomContract.owner();
        setIsDeployer(deployerAddress.toLowerCase() === accounts[0].toLowerCase());
      } catch (error) {
        console.error('连接钱包时出错', error);
      }
    } else {
      alert('请安装 MetaMask 钱包扩展！');
    }
  };

  const getMyProperties = async () => {
    if (!buyMyRoomContract || !account) return;
    try {
      const propertyCount = await buyMyRoomContract.balanceOf(account);
      if (propertyCount.isZero()) {
        alert('您还没有房产。');
      } else {
        const myProperties = [];
        for (let i = 0; i < propertyCount; i++) {
          const tokenId = await buyMyRoomContract.tokenOfOwnerByIndex(account, i);
          const property = await buyMyRoomContract.houses(tokenId);
          myProperties.push({ tokenId: tokenId.toString(), ...property });
        }
        setProperties(myProperties);
      }
      setViewedProperties(true);
    } catch (error) {
      console.error('获取房产列表失败', error);
    }
  };

  const getSaleProperties = async () => {
    if (!buyMyRoomContract || !account) return; // 确保合约和用户已连接
    try {
      const salePropertiesList = [];
      const totalSupply = await buyMyRoomContract.totalSupply();

      for (let i = 1; i <= totalSupply; i++) {
        const property = await buyMyRoomContract.houses(i);
        const owner = await buyMyRoomContract.ownerOf(i);

        // 仅在房产为出售状态且不属于当前用户时添加
        if (property.isForSale && owner.toLowerCase() !== account.toLowerCase()) {
          salePropertiesList.push({ tokenId: i, ...property, owner });
        }
      }

      // 更新在售房产列表状态
      setSaleProperties(salePropertiesList);
      setViewedSaleProperties(true);

      if (salePropertiesList.length === 0) {
        alert('没有可购买的房产。');
      }
    } catch (error) {
      console.error('获取在售房产列表失败', error);
    }
  };

  const listHouseForSale = async (tokenId: number, price: string) => {
    if (!buyMyRoomContract) return;
    try {
      const tx = await buyMyRoomContract.listHouseForSale(tokenId, ethers.utils.parseEther(price));
      await tx.wait();
      alert('房产已成功挂单');
      getMyProperties();
    } catch (error) {
      console.error('挂单失败', error);
    }
  };

  const delistHouse = async (tokenId: number) => {
    if (!buyMyRoomContract) return;
    try {
      const tx = await buyMyRoomContract.delistHouse(tokenId);
      await tx.wait();
      alert('房产已取消挂单');
      getMyProperties();
    } catch (error) {
      console.error('取消挂单失败', error);
    }
  };

  const buyHouse = async (tokenId: number, paymentType: 'ETH' | 'Token') => {
    if (!buyMyRoomContract || !tokenContract || !account) return;

    try {
      let tx;
      if (paymentType === 'ETH') {
        const house = await buyMyRoomContract.houses(tokenId);
        tx = await buyMyRoomContract.buyHouseWithEther(tokenId, { value: house.price });
      } else {
        // 获取代币购买房产所需的代币数量
        const house = await buyMyRoomContract.houses(tokenId);
        const requiredTokenAmount = BigNumber.from(house.price).mul(tokenExchangeRate);

        // 检查用户的授权代币数量
        const allowance = await tokenContract.allowance(account, BUY_MY_ROOM_CONTRACT_ADDRESS);
        if (allowance.lt(requiredTokenAmount)) {
          alert("请先授权足够的代币");
          return;
        }

        tx = await buyMyRoomContract.buyHouseWithTokens(tokenId);
      }
      await tx.wait();
      alert('房产购买成功');
      getSaleProperties(); // 更新可售房产列表
    } catch (error: unknown) {
      console.error('购买失败', error);
      alert(`购买失败: ${(error as any).message || error}`);
    }
  };

  const exchangeEtherForTokens = async () => {
    if (!buyMyRoomContract || !tokenContract || !account) {
      console.error('合约或账户未连接');
      return;
    }

    try {
      const tx = await buyMyRoomContract.exchangeEtherForTokens({ value: ethers.utils.parseEther(ethToExchange) });
      await tx.wait();
      alert('代币兑换成功');

      // 更新用户的代币余额
      const tokenBalance = await tokenContract.balanceOf(account);
      setTokenBalance(ethers.utils.formatUnits(tokenBalance, 18));

      // 更新用户的ETH余额
      const ethBalance = await buyMyRoomContract.provider.getBalance(account);
      setEthBalance(ethers.utils.formatEther(ethBalance));

    } catch (error) {
      console.error('兑换失败', error);
    }
  };

  const updateListingFee = async () => {
    if (!buyMyRoomContract) return;
    try {
      const tx = await buyMyRoomContract.setListingFeePercent(updatedFee);
      await tx.wait();
      alert('手续费比例更新成功');
      setListingFee(updatedFee);
      setDialogVisible(null);
    } catch (error) {
      console.error('更新手续费比例失败', error);
    }
  };

  const updateTokenExchangeRate = async () => {
    if (!buyMyRoomContract) return;
    try {
      const tx = await buyMyRoomContract.setTokenExchangeRate(updatedExchangeRate);
      await tx.wait();
      alert('代币兑换汇率更新成功');
      setTokenExchangeRate(updatedExchangeRate);
      setDialogVisible(null);
    } catch (error) {
      console.error('更新代币兑换汇率失败', error);
    }
  };
// 铸造代币的函数
  const mintTokens = async () => {
    if (!tokenContract || !account || !isDeployer) return;
    try {
      const tx = await tokenContract.mint(mintToAddress, ethers.utils.parseUnits(mintAmount, 18));
      await tx.wait();

      alert(`成功铸造 ${mintAmount} 个代币到 ${mintToAddress}`);

      // 更新代币余额
      const updatedTokenBalance = await tokenContract.balanceOf(account);
      setTokenBalance(ethers.utils.formatUnits(updatedTokenBalance, 18));
    } catch (error) {
      console.error('代币铸造失败', error);
    }
  };

  // 铸造房屋NFT的函数
  const mintHouse = async () => {
    if (!buyMyRoomContract || !account || !isDeployer) return;
    try {
      const tx = await buyMyRoomContract.mintHouse(newHouseOwner);
      await tx.wait();
      alert(`成功铸造房屋NFT给 ${newHouseOwner}`);
    } catch (error) {
      console.error('房屋铸造失败', error);
    }
  };

  // 给合约授权代币的函数
  const authorizeTokens = async () => {
    if (!tokenContract || !account) return;
    try {
      const tx = await tokenContract.approve(
          BUY_MY_ROOM_CONTRACT_ADDRESS,
          ethers.utils.parseUnits(authorizationAmount, 18)
      );
      await tx.wait();
      alert(`已授权 ${authorizationAmount} 个代币给合约`);
    } catch (error) {
      console.error('授权代币失败', error);
    }
  };

  useEffect(() => {
    if (account) {
      // getMyProperties();
      // getSaleProperties();
    }
  }, [account]);

  return (
      <div className="App">
        <header className="App-header">
          <h1>去中心化房屋购买系统</h1>
          {!account ? (
              <button onClick={connectWallet}>连接钱包</button>
          ) : (
              <div>
                {/* 账户信息区块 */}
                <section className="section account-info">
                  <h2>账户信息</h2>
                  <p>当前账户: {account}</p>
                  <p>ETH余额: {ethBalance} ETH</p>
                  <p>代币余额: {tokenBalance} TTK</p>
                  <p>手续费比例: {listingFee}%</p>
                  <p>代币兑换汇率: 1 ETH = {tokenExchangeRate} TTK</p>
                  {!isDeployer && (
                      <button onClick={() => setDialogVisible('exchange')}>兑换代币</button>
                  )}
                </section>

                {/* 房产管理区块 */}
                <section className="section property-management">
                  <h2>房产管理</h2>
                  <button onClick={getMyProperties}>查看我的房产</button>
                  <button onClick={getSaleProperties}>查看可购买房产</button>

                  {/* 我的房产列表 */}
                  {viewedProperties && (
                      <div className="property-list">
                        <h3>我的房产</h3>
                        {properties.length > 0 ? (
                            properties.map((property) => (
                                <div className="card" key={property.tokenId}>
                                  <p>房产ID: {property.tokenId}</p>
                                  <p>价格: {ethers.utils.formatEther(property.price.toString())} ETH</p>
                                  <p>是否在售: {property.isForSale ? '是' : '否'}</p>
                                  {property.isForSale ? (
                                      <button onClick={() => delistHouse(property.tokenId)}>取消挂单</button>
                                  ) : (
                                      <button
                                          onClick={() => setDialogVisible(`list-${property.tokenId}`)}>挂单出售</button>
                                  )}
                                </div>
                            ))
                        ) : (
                            <p>您还没有房产。</p>
                        )}
                      </div>
                  )}

                  {/* 可购买房产列表 */}
                  {viewedSaleProperties && (
                      <div className="property-list">
                        <h3>可购买房产</h3>
                        {saleProperties.length > 0 ? (
                            saleProperties.map((property) => (
                                <div className="card" key={property.tokenId}>
                                  <p>房产ID: {property.tokenId}</p>
                                  <p>价格: {ethers.utils.formatEther(property.price.toString())} ETH</p>
                                  <p>所有者: {property.owner}</p>
                                  <button onClick={() => buyHouse(property.tokenId, 'ETH')}>用ETH购买</button>
                                  <button onClick={() => buyHouse(property.tokenId, 'Token')}>用Token购买</button>
                                </div>
                            ))
                        ) : (
                            <p>没有可购买的房产。</p>
                        )}
                      </div>
                  )}
                </section>

                <section className="section token-authorization">
                  <h2>代币授权</h2>
                  <input
                      type="text"
                      value={authorizationAmount}
                      onChange={(e) => setAuthorizationAmount(e.target.value)}
                      placeholder="授权代币数量"
                  />
                  <button onClick={authorizeTokens}>授权代币</button>
                </section>

                {/* 管理功能区块 */}
                <section className="section admin-actions">
                  {isDeployer && (
                      <div>
                        <h2>管理功能 (仅限合约部署者)</h2>

                        {/* 铸造代币 */}
                        <h3>铸造代币</h3>
                        <input
                            type="text"
                            value={mintToAddress}
                            onChange={(e) => setMintToAddress(e.target.value)}
                            placeholder="接收代币地址"
                        />
                        <input
                            type="text"
                            value={mintAmount}
                            onChange={(e) => setMintAmount(e.target.value)}
                            placeholder="代币数量"
                        />
                        <button onClick={mintTokens}>铸造代币</button>

                        {/* 铸造房屋 */}
                        <h3>铸造房屋NFT</h3>
                        <input
                            type="text"
                            value={newHouseOwner}
                            onChange={(e) => setNewHouseOwner(e.target.value)}
                            placeholder="房屋接收地址"
                        />
                        <button onClick={mintHouse}>铸造房屋</button>

                      </div>
                  )}

                  {isAdmin && (
                      <div>
                        <button onClick={() => setDialogVisible('updateFee')}>调整手续费比例</button>
                        <button onClick={() => setDialogVisible('updateExchangeRate')}>调整代币汇率</button>
                      </div>
                  )}
                </section>

                {/* 弹窗 */}
                {dialogVisible === 'exchange' && (
                    <div className="dialog">
                      <h2>兑换代币</h2>
                      <input
                          type="text"
                          value={ethToExchange}
                          onChange={(e) => setEthToExchange(e.target.value)}
                          placeholder="输入ETH数量"
                      />
                      <button onClick={() => {
                        exchangeEtherForTokens();
                        setDialogVisible(null);
                      }}>确定
                      </button>
                      <button onClick={() => setDialogVisible(null)}>取消</button>
                    </div>
                )}

                {dialogVisible && dialogVisible.startsWith('list-') && (
                    <div className="dialog">
                      <h2>挂单出售房产</h2>
                      <input
                          type="text"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          placeholder="输入挂单价格 (ETH)"
                      />
                      <button onClick={() => {
                        listHouseForSale(parseInt(dialogVisible.split('-')[1]), newPrice);
                        setDialogVisible(null);
                      }}>确定
                      </button>
                      <button onClick={() => setDialogVisible(null)}>取消</button>
                    </div>
                )}

                {dialogVisible && dialogVisible === 'updateFee' && (
                    <div className="dialog">
                      <h2>调整手续费比例</h2>
                      <input
                          type="text"
                          value={updatedFee}
                          onChange={(e) => setUpdatedFee(e.target.value)}
                          placeholder="输入新手续费比例"
                      />
                      <button onClick={updateListingFee}>确定</button>
                      <button onClick={() => setDialogVisible(null)}>取消</button>
                    </div>
                )}

                {dialogVisible && dialogVisible === 'updateExchangeRate' && (
                    <div className="dialog">
                      <h2>调整代币兑换汇率</h2>
                      <input
                          type="text"
                          value={updatedExchangeRate}
                          onChange={(e) => setUpdatedExchangeRate(e.target.value)}
                          placeholder="输入新代币兑换汇率"
                      />
                      <button onClick={updateTokenExchangeRate}>确定</button>
                      <button onClick={() => setDialogVisible(null)}>取消</button>
                    </div>
                )}
              </div>
          )}
        </header>
      </div>
  );
}

export default App;