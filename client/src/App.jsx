import React, { useState } from 'react'

import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';

function App() {

  const [voteCount1, setVoteCount1] = useState(0);
  const [voteCount2, setVoteCount2] = useState(0);

  const [walletBalance, setWalletBalance] = useState(null);
  const [address, setAddress] = useState(null);


  const getRecentBlockhash = async () => {
    let connection = getConnection();
    let blockhash = await connection.getRecentBlockhash("max");
    return blockhash;
  }

  const getConnection = () => {
    let connection = new Connection("http://localhost:8899", "confirmed");
    return connection;
  }

  const getPublicKey = () => {
    // Okay so I had my localnet offline and thus it was failing. Nothing to do with
    // Publickey or Keypair
    let userAddress = new PublicKey(window.solana.publicKey.toString());
    // console.log(window.solana.publicKey.toBuffer())
    // console.dir(userAddress);
    // console.log(userAddress.__proto__);
    // let user = new Keypair(userAddress);
    // console.log(user);
    return userAddress;
  }

  const handleRequestAirdrop = async () => {
    // handle error case later -> Also one behind. Maybe react thing?
    let connection = getConnection();
    await connection.requestAirdrop(getPublicKey(), LAMPORTS_PER_SOL)
    getBalance();
  }

  const getBalance = async () => {
    let connection = getConnection();
    const res = await connection.getBalance(getPublicKey());
    console.log(res);
    setWalletBalance(res);
  }

  // Just create the address of PDA here but init the account when you vote.
  const getDerivedAccountAddress = async () => {
    let checkAccountPubkey = await PublicKey.createWithSeed(getPublicKey(), seed, VOTING_CONTRACT_PROGRAMID);
    return checkAccountPubkey;
  }

  const handleConnectWallet = async () => {
    // Check if phantom is installed or not and prompt to install it.
    if (window.solana && window.solana.isPhantom) {
      const res = await window.solana.connect();
      // console.log(res);// undefined

      // update address and balance of the wallet
      setAddress(window.solana.publicKey.toString());
      getBalance();
      getDerivedAccountAddress();
      // console.log(getConnection())
    } else {
      alert("Phantom wallet is not installed. Please install.");
      window.open("https://phantom.app/", "_target");
    }
  }

  return (
    <div className="App">
      <h1>Voting Contracts</h1>

      {!address && <p>Connect your wallet</p> && <button onClick={handleConnectWallet}>Connect Wallet</button>}
      {address && <p>{address} is the user address that is connected right now!</p>}
      {(walletBalance !== null) && <p>{walletBalance / LAMPORTS_PER_SOL} SOL is the amount of money this connected user has</p>}
      {address && <button onClick={handleRequestAirdrop}>Request Airdrop</button>}
      <br />

      <div>
        <h2>Candidate #1 Details</h2>
        <p>{voteCount1} votes</p>
        <button onClick={handleVote.bind(this, 1)}>Vote for 1</button>
      </div>

      <div>
        <h2>Candidate #2 Details</h2>
        <p>{voteCount2} votes</p>
        <button onClick={handleVote.bind(this, 2)} > Vote for 2</button>
      </div>
    </div >
  )
}

export default App
