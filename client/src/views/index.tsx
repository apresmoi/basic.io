import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client';
const socketURL = `http://localhost:8081/`;

const Container = (props) => {
  return <div style={{ display: 'flex', width: '100%', height: '100%' }}>
    <div style={{ width: 500, height: 500, background: 'white', margin: 'auto' }}>
      <svg width={500} height={500}>
        {props.children}
      </svg>
    </div>
  </div>
}

class World extends React.Component<{}, {}> {
  socket = io(socketURL, {
    path: `/ws`,
    autoConnect: true,
  });

  render() {
    return <Container>
    </Container>
  }
}

export { World }