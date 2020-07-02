import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client';
const socketURL = `http://localhost:8081/`;

interface Player {
  id: string
  x: number
  y: number
  dx: number
  dy: number
}

interface WorldState {
  self?: Player
}

const Container = (props) => {
  return <div style={{ display: 'flex', width: '100%', height: '100%' }}>
    <div style={{ width: 500, height: 500, background: 'white', margin: 'auto' }}>
      <svg width={500} height={500}>
        {props.children}
      </svg>
    </div>
  </div>
}

const Player = (props: Player) => {
  const { x, y, id } = props
  return <g transform={`translate(${x}, ${y})`}>
    <circle r={10} />
    <text textAnchor="middle" transform={`translate(0, 30)`}>{id}</text>
  </g>
}

class World extends React.Component<{}, WorldState> {
  socket = io(socketURL, {
    path: `/ws`,
    autoConnect: false,
  });

  constructor() {
    super({})
    this.state = {
      self: null
    }

    this.socket.on('login_success', (payload) => {
      console.log('login_success', payload)
      this.setState({ self: payload })
    })

    this.socket.connect()
  }

  render() {
    const { self } = this.state
    return <Container>
      {self && <Player {...self} />}
    </Container>
  }
}

export { World }