import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client';
const socketURL = `http://localhost:8081/`;

class World extends React.Component<{}, {}> {
  socket = io(socketURL, {
    path: `/ws`,
    autoConnect: true,
  });

  render() {
    return null
  }
}

export { World }