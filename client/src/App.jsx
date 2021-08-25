import React, { useState } from 'react'
import './App.css'

function App() {

  const [voteCount1, setVoteCount1] = useState(0);
  const [voteCount2, setVoteCount2] = useState(0);

  const [walletBalance, setWalletBalance] = useState(null);
  const [address, setAddress] = useState(null);

  const handleVote = (votedFor) => {
    console.log("voted for", votedFor)
  }

  return (
    <div className="App">
      <h1>Voting Contracts</h1>
      <p>Connect your wallet</p>
      { !address &&<button>Connect Wallet</button> }
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
