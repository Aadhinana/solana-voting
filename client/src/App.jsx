import React, { useState } from 'react'

import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, SystemProgram, TransactionInstruction, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';

// Need to deploy the contract and figure out how to create the account for data storage
const VOTING_CONTRACT_PROGRAMID = "";
const VOTING_CONTRACT_ACCOUNT = "";
const seed = "something";

function App() {

  const [voteCount1, setVoteCount1] = useState(0);
  const [voteCount2, setVoteCount2] = useState(0);

  const [walletBalance, setWalletBalance] = useState(null);
  const [address, setAddress] = useState(null);

  const handleVote = async (votedFor) => {
    console.log("voted for", votedFor);

    // This needs to be calculated in a better way, like hit the chain and caluclate
    let lamportsForRentExemption = LAMPORTS_PER_SOL * 2;

    let userAccountAddress = getPublicKey(); 
    let checkAccountPubkey = getDerivedAccountAddress(); 

    // create the PDA Account of this user
    let transaction = await SystemProgram.createAccountWithSeed({
      basePubkey: userAccountAddress,
      fromPubkey: userAccountAddress,
      newAccountPubkey: checkAccountPubkey,
      programId: VOTING_CONTRACT_PROGRAMID,
      seed: seed,
      lamports: lamportsForRentExemption,
      space: 4
    });

    const instruction_data = new Uint8Array([votedFor]);

    // Create instruction to send to the chain
    // includes all accounts required, data and the program Id
    const instruction = new TransactionInstruction({
      keys: [
        {pubkey: VOTING_CONTRACT_ACCOUNT, isSigner: false, isWritable: true},
        {pubkey: checkAccountPubkey, isSigner: false, isWritable: false},
        {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false}, 
        {pubkey: userAccountAddress, isSigner: true, isWritable: false}
      ],
      data: instruction_data,
      programId: VOTING_CONTRACT_PROGRAMID
    })

    transaction = transaction.add(instruction);

    // Add blockhash and sign transaction
    transaction.recentBlockhash = (await getRecentBlockhash()).blockhash;
    transaction.sign(userAccountAddress);

    // Serialize transaction and send it over to chain
  }

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
