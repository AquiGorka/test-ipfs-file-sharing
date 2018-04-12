import React, { Component } from 'react'
import IPFS from 'ipfs'

const ipfsConfig = {
  repo: 'ipfs-file-sharing' + Math.random(),
  config: {
    Addresses: {
      Swarm: [
        '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star',
        //'/ip4/127.0.0.1/tcp/9191/ws/p2p-websocket-star',
      ],
    },
    Bootstrap: []
  },
}

const getByteString = src => {
  if (src.split(',')[0].indexOf('base64') >= 0) {
    return atob(src.split(',')[1])
  }
  return decodeURI(src.split(',')[1])
}

const convertToTypedArray = src => {
  const byteString = getByteString(src)
  let ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return ia
}

const toBase64 = src =>
  `data:image/gif;base64,${btoa(new Uint8Array(src).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`

let node

class App extends Component {

  state = { src: null }

  componentDidMount() {
    node = new IPFS(ipfsConfig)
    node.once('ready', () => {
      console.log('Node ready')
    })
  }

  render() {
    return (
      <div>
        <input
          type="file"
          onChange={this.upload}
          ref={n => this.node = n}
        />
        <button onClick={this.get}>Get</button>
        <input
          type="text"
          ref={i => this.input = i}
        />
        {this.state.src &&
          <img src={this.state.src} alt="Container" />}
      </div>
    )
  }

  get = async () => {
    const hash = this.input.value
    if (!hash.trim()) {
      console.log('Please enter a hash')
      return
    }
    console.log('Getting the file. Hash: ', hash)
    let n = 0
    const interval = setInterval(() => {
      n++
      if (n > 60) {
        console.log('1 minute. Not gonna happen, you can go home now')
        clearInterval(interval)
      }
      if (n === 30) {
        console.log('30 secs')
      }
      if (n === 5) {
        console.log('5 secs')
      }
    }, 1000)
    const stream = await node.files.cat(hash)
    clearInterval(interval)
    console.log('Got the file')
    //console.log(stream)
    const src = toBase64(stream)
    //console.log(src)
    this.setState({ src })
  }

  upload = () => {
    const reader = new FileReader();
    reader.onload = async e => {
      //console.log(e.target.result)
      const res = await node.files.add(Buffer.from(convertToTypedArray(e.target.result)))
      console.log('Use this hash: ', res[0].hash)
    }
    if (this.node.files.length) {
      reader.readAsDataURL(this.node.files[0]);
    } else {
      console.log('Please choose a file')
    }
  }
}

export default App
