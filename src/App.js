import { Alchemy, Network } from 'alchemy-sdk';
import { useState } from 'react';
import './App.css';
const sanitize = require('./sanitize');
// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  return (<div>
    <BlockHeader />
  </div>);
}

function BlockHeader() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockHeader, setSummary] = useState("");
  function getBlockNumber() {
    if (!blockNumber) {
      alchemy.core.getBlockNumber('latest').then((blockN) => {
        setBlockNumber(blockN);
        alchemy.core.getBlockWithTransactions(blockNumber).then((trans) => {
          setSummary(sanitize.default(trans));
          return;
        });

      });
    }
  }
  getBlockNumber();
  function onNextClick() {
    setBlockNumber(null);
  }
  return (blockHeader ? <div className="App">
    <div className="container summary">
      <button className='button' onClick={onNextClick}>Next Block &gt;&gt;&gt;</button>
      <div className="balance"><b>Block Number</b>   : {blockHeader['number']}</div>
      <div className="balance"><b>Timestamp</b>    : {new Date(blockHeader['timestamp'] * 1000).toUTCString()}</div>
      <div className="balance"><b>Nonce</b>        : {blockHeader['nonce']}</div>
      <div className="balance"><b>Total Difficulty</b> : {blockHeader['difficulty']}</div>
      <div className="balance"><b>Gas Used</b> : {blockHeader.gasUsed}</div>
      <div className="balance"><b>Gas Limit</b> : {blockHeader.gasLimit}</div>
    </div>
    <div className="container">
      <h4>Transactions</h4>
      <ProductTable blockHeader={blockHeader} transactions={blockHeader.transactions} />
    </div>
  </div> : <div></div>);
}
function ProductRow({ transItem, timestamp }) {

  transItem = sanitize.default(transItem);
  return (
    <tr>
      <td>{transItem.hash.slice(0, 10)}...</td>
      <td>{transItem.type}</td>
      <td>{timeSince(timestamp)}</td>
      <td>{(transItem.from).slice(0, 10)}...</td>
      <td>{transItem.to ? (transItem.to).slice(0, 10) : ''}...</td>
      <td>{transItem.value}</td>
      <td>{transItem.gasPrice}</td>
    </tr>
  );
}

function ProductTable({ blockHeader, transactions }) {
  const rows = [];
  if (transactions && transactions.length) {
    for (let index = 0; index < transactions.length; index++) {
      const transaction = transactions[index];
      rows.push(<ProductRow transItem={transaction} timestamp={blockHeader.timestamp} />);
    }
  }

  return (<table id={blockHeader.hash}>
    <thead>
      <tr>
        <th>Hash</th>
        <th>Type</th>
        <th>Age</th>
        <th>From</th>
        <th>To</th>
        <th>Value</th>
        <th>Txn Fee</th>
      </tr>
    </thead>
    <tbody>{rows.length > 0 ? rows : <tr><td colSpan={7}>No data</td></tr>}</tbody>
  </table>);
}

function timeSince(timestamp) {
  let date = new Date(Date.now() - timestamp);
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

export default App;
