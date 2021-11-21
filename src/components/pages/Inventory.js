import React from 'react';
import '../../App.css';
import {Button} from '../Button';
import axios from 'axios';
import Web3 from "web3";
import Web3Modal from "web3modal";

export default function Inventory() {

  const apiCall = async () => {
 
    const providerOptions = {
      /* See Provider Options Section */
    };
    
    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });
    
    const provider = await web3Modal.connect();
    
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts: string[]) => {
      console.log(accounts);
    });
    
    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {
      console.log(chainId);
    });
    
    // Subscribe to provider connection
    provider.on("connect", (info: { chainId: number }) => {
      console.log(info);
    });
    
    // Subscribe to provider disconnection
    provider.on("disconnect", (error: { code: number; message: string }) => {
      console.log(error);
    });
    
    const web3 = new Web3(provider);

    const address = web3.currentProvider.selectedAddress;
 
    axios.get(`https://api.nftport.xyz/v0/accounts/${address}`, {
      params: {
        chain: 'ethereum',
      },
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': '4162f7a3-40f4-4f6b-8c8d-e735d3cc9590'
      },
    })
    .then(function (response) {
      console.log({address});
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  return (
    <>
      <h1 className='products'>INVENTORY
      <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={apiCall}
        >
          Connect Wallet<i className='far fa-play-circle' />
        </Button>
      </h1>
     
      {/* <Button onClick={apiCall}>Lets do an API call</Button> */}
    </>  
  );
}