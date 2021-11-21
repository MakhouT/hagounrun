import axios from "axios";
import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";
import * as Web3 from 'web3';
import Web3Modal from "web3modal";

export default class Home extends React.Component {
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
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

        <Button onClick={this.getNFTs} label="Load NFTs"/>
        <h1>  
          <div style={{width: 800, marginBottom: 50, margin:'0px auto'}}>
            <Unity unityContent={this.unityContent} />
          </div>
          <div style={{marginBottom: '30px'}}>
          {this.state.availableBackgrounds.map((bg, i) => (
            <Button key={bg} onClick={() => this.mint(bg.toLowerCase())} label={`Mint ${bg}`}/>
          ))}
          </div>
        </h1>  
      </div>
    );
  }
}

const Button = (props) => {
  const {label,style} = props;
  return (
    <button {...props} style={{
        margin: '100px 10px',
        padding: '20px 50px',
        fontSize: '20px',
        border: 'none',
        background: '#611818',
        color: 'white',
        cursor: 'pointer',
        ...style,
    }}>{label}</button>
  );
}
