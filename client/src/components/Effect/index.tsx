import React from 'react';
import { IEffect } from '../../types';

const Effect = (props: IEffect) => {
  const { x, y } = props;
  return <g transform={`translate(${x}, ${y})`}>
    <circle r={2} />
  </g>
}

export { Effect }