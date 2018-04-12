# Testing IPFS file sharing

Using [`js-ipfs`](https://github.com/ipfs/js-ipfs) to add and retrieve files. There are two methods to make peers find each other and share data between them:

- Using `webrtc`. Nodes use a [`signalling server`](https://github.com/libp2p/js-libp2p-webrtc-star) to connect directly to each other. The server has no access to the data.
- Using `websockets`. Nodes use a [`socket.io server`](https://github.com/libp2p/js-libp2p-websocket-star) to connect to each other and share data. The server relays the data.

## Install dependencies

```sh
yarn
```

## Test run

1. Spin up the signalling server `npx star-signal`
2. `yarn start` (make sure the config for the IPFS nodes point to the `p2p-webrtc-star` swarm address.
3. Open up some browsers to `localhost:3000` (e.g. One regular Chrome, one Incognito Chrome, one Safari and one Firefox).
4. Add files using either browser and try to fetch them with the other browsers. By using the provided mock files browser work correctly if using the smaller files.

**Firefox**

5. `yarn start` another app and open up another Firefox browser to `localhost:3001`
6. Using both Firefox browsers all the provided files should be shared correctly.


## What is going on?

Probably these:

- https://github.com/ipfs/js-ipfs-bitswap/pull/152
- https://github.com/ipfs/js-ipfs/issues/1019


## WebRTC setup

Make sure the IPFS node config has the `p2p-webrtc-star` swarm address uncommented.

```sh
# in one terminal
npx star-signal

# in another terminal
yarn start
```

**Chrome and Safari** are not able to share files bigger than 256Kb (tested with 500Kb files actual limit might be different).

Latest Firefox works ok with files (tested with files up to 3Mb).


## Websockets setup

Make sure the IPFS node config has the `p2p-websocket-star` swarm address uncommented.

```sh
# in one terminal
npx rendezvous --port=9191

# in another terminal
yarn start
```

All browsers work as they should and are able to share files (tested with files up to 3Mb).

