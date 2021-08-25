import React, { useState } from 'react'

import { Connection } from '@solana/web3.js';

function App() {

  const [voteCount1, setVoteCount1] = useState(0);
  const [voteCount2, setVoteCount2] = useState(0);

  const [walletBalance, setWalletBalance] = useState(null);
  const [address, setAddress] = useState(null);

  const handleVote = (votedFor) => {
    console.log("voted for", votedFor)
  }

  const getConnection = () => {
    let connection = new Connection("http://localhost:8899", "confirmed");
    return connection;
  }

  const handleConnectWallet = async () => {
    // Check if phantom is installed or not and prompt to install it.
    if (window.solana && window.solana.isPhantom) {
      const res = await window.solana.connect();
      // console.log(res);// undefined

      // update address and balance of the wallet
      setAddress(window.solana.publicKey.toString());

      console.log(getConnection())
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
      {walletBalance && <p>{walletBalance} is the amount of money this connected user has</p>}
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
