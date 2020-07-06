import React from 'react';
import { IPlayer } from '../../types';

const Player = (props: IPlayer) => {
  const { x, y, id, dead } = props
  return <g transform={`translate(${x}, ${y})`}>
    <circle r={10} fill={dead ? 'red' : 'black'} />
    <text textAnchor="middle" transform={`translate(0, 30)`}>{id}</text>
  </g>
}

export { Player }