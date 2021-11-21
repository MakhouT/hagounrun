import axios from "axios";
import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";
import * as Web3 from 'web3';
import Web3Modal from "web3modal";

export default class EnterGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      nfts: [],
      availableBackgrounds: ['desert', 'city', 'suburbs', 'egypt', 'sea'],
    };

    this.unityContent = new UnityContent(
      '/Build/1.json', 
      '/Build/UnityLoader.js'
    );

    this.getNFTs = this.getNFTs.bind(this);
    this.mint = this.mint.bind(this);
    this.getAddress = this.getAddress.bind(this);
    this.sendToUnity = this.sendToUnity.bind(this);
  }

  previous() {
    this.unityContent.send("GameManager", "Previous");
  }

  sendToUnity() {
    const names = this.state.nfts.map(nft => nft.name);
    const haveBackgrounds = this.state.availableBackgrounds.map(bg => names.includes(bg) ? '1' : '0').join('');
    console.log(haveBackgrounds);
 
    // this.unityContent.send("GameManager", "Next", this.state.nfts);
    this.unityContent.send("GameManager", "UnlockWithString", haveBackgrounds);
  }

  async getAddress() {
    const providerOptions = {};

    const web3Modal = new Web3Modal({
      providerOptions,
    });
    
    const providerWeb3 = await web3Modal.connect();
    const web3 = new Web3(providerWeb3);
    const address = web3.currentProvider.selectedAddress;

    this.setState({address});
    console.log(this.state);
  }

  async mint(name){

    if(!this.state.address){
      await this.getAddress();
    }
    const options = {
      method: 'POST',
      url: 'https://api.nftport.xyz/v0/mints/easy/urls',
      headers: {'Content-Type': 'application/json', Authorization: '4162f7a3-40f4-4f6b-8c8d-e735d3cc9590'},
      data: {
        chain: 'polygon',
        name,
        description: 'Testing How it works!',
        file_url: 'https://cdn.vox-cdn.com/thumbor/GnlLz4NRbZjkEpSJWlrYHlItR1k=/1400x0/filters:no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/22443194/Clever_Lumimancer_EN.png',
        mint_to_address: this.state.address
      }
    };
    
    axios.request(options).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }

  async getNFTs() {
    if(!this.state.address){
      await this.getAddress();
    }

    var that = this;

    axios.get(`https://api.nftport.xyz/v0/accounts/${this.state.address}`, {
      params: {
        chain: 'polygon',
        include: 'metadata'
      },
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': '4162f7a3-40f4-4f6b-8c8d-e735d3cc9590'
      },
    })
    .then(function (response) {
      console.log(response.data.nfts);
      that.setState({
        nfts: response.data.nfts,
      });
      that.sendToUnity();
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }

  render() {
    return (
      <div>
        <h1 style={{
          background: '#1a1919',
          borderTop: '3px solid white',
          paddingTop: '20px',
        }}>  
        <Button onClick={this.getNFTs} label="Load NFTs"/>
        
        <div style={{marginBottom: '30px'}}>
        {this.state.availableBackgrounds.map(bg => (
          <Button key={bg} onClick={() => this.mint(bg.toLowerCase())} label={`Mint ${bg}`}/>
        ))}
        </div>

       <div style={{width: 800, marginBottom: 50, margin:'0px auto'}}>
         <Unity unityContent={this.unityContent} />
       </div>
        </h1>  
      </div>
    );
  }
}

const Button = (props) => {
  const {label} = props;
  return (
    <button {...props} style={{
        margin: '10px',
        padding: '10px 30px',
        fontSize: '16px',
        border: 'none',
        background: 'navajowhite',
        cursor: 'pointer',
    }}>{label}</button>
  );
}


// import React, {useEffect, useState} from 'react';
// import { Button } from '../Button';
// import Unity, { UnityContent } from "react-unity-webgl";

// import '../../App.css';

// const unityContent = new UnityContent('../../../public/Build/Build/jojo.json', '../../../public/Build/Build/UnityLoader.js');

// export default function Services() {
//   // const [locked, setLocked] = useState('pending');

//   // const unlockHandler = e => {
//   //   setLocked(e.detail);
//   // }

//   // useEffect(() => {
//   //   window.addEventListener("unlockProtocol", unlockHandler);
//   //   return window.removeEventListener("unlockProtocol", unlockHandler);
//   // }, []);

//   // const unlock = () =>{
//   //   window.unlockProtocol && window.unlockProtocol.loadCheckoutModal();
//   // };

//   // function spawnEnemies() {
//   //   unityContent.send("GameController", "Next");
//   // }

//   return (
//     <>
//       {/* <button onClick={spawnEnemies}>Spawn a bunch!</button> */}
//       <Unity UnityContent={unityContent} />
//     </>
    
//     // <>
//     //   <h1 className='services'>SERVICES
    
//     //   <Button
//     //       className='btns'
//     //       buttonStyle='btn--primary'
//     //       buttonSize='btn--large'
//     //       onClick={unlock}
//     //     >
//     //       Unlock<i className='far fa-play-circle' />
//     //   </Button>
//     //   </h1>
//     //   {locked === 'unlocked' && 'Im unlocked'}
//     //   {locked !== 'unlocked' && <Button onClick={unlock}>Unlock</Button>}

      
//     // </>
//   );
// }