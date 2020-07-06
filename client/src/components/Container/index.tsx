import React from 'react';

const Container = (props) => {
  return <div style={{ display: 'flex', width: '100%', height: '100%' }}>
    <div style={{ width: 500, height: 500, background: 'white', margin: 'auto' }}>
      <svg width={500} height={500}>
        {props.children}
      </svg>
    </div>
  </div>
}

export { Container }