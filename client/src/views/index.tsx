import React from 'react'
import io from 'socket.io-client';
const socketURL = `http://localhost:8081/`;

interface Player {
  id: string
  x: number
  y: number
  dx: number
  dy: number
}

interface Effect {
  x: number
  y: number
}

interface WorldState {
  self?: Player
  players: Player[]
  keys: string[]
  effects: Effect[]
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

const Effect = (props: Effect) => {
  const { x, y } = props;
  return <g transform={`translate(${x}, ${y})`}>
    <circle r={2} />
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
      self: null,
      players: [],
      keys: [],
      effects: []
    }

    this.socket.on('login_success', (payload) => {
      console.log('login_success', payload)
      this.setState({ ...payload })
    })

    this.socket.on('player_join', (payload) => {
      console.log('player_join', payload)
      this.setState({ players: [...this.state.players, payload] })
    })

    this.socket.on('player_leave', (payload) => {
      console.log('player_leave', payload)
      this.setState({ players: this.state.players.filter(p => p.id !== payload.id) })
    })

    this.socket.on('update', (payload) => {
      this.setState({
        self: payload.players[this.state.self.id],
        players: Object.values(payload.players).filter((p: Player) => p.id !== this.state.self.id) as Player[],
        effects: payload.effects,
      })
    })

    this.socket.connect()
  }

  componentDidMount(): void {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  directionChanged = () => {
    const { keys, self } = this.state;
    const direction = { x: 0, y: 0 }
    if (keys.includes('ArrowUp')) direction.y = -1
    if (keys.includes('ArrowDown')) direction.y = 1
    if (keys.includes('ArrowRight')) direction.x = 1
    if (keys.includes('ArrowLeft')) direction.x = -1

    this.socket.emit('request_direction_change', direction)
  }

  handleKeyDown = (e): void => {
    const { code } = e;
    const allowedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
    if (allowedKeys.includes(code) && !this.state.keys.includes(code)) {
      this.setState({ keys: [...this.state.keys, code] }, this.directionChanged)
    }
    else if (code === 'Space') {
      this.socket.emit('request_shoot', {})
    }
  }

  handleKeyUp = (e): void => {
    const { code } = e;
    if (this.state.keys.includes(code))
      this.setState({ keys: this.state.keys.filter(k => k !== code) }, this.directionChanged)
  }

  render() {
    const { self, players, effects } = this.state
    return <Container>
      {self && <Player {...self} />}
      {players.map(player => <Player key={player.id} {...player} />)}
      {effects.map((effect, i) => <Effect key={i} {...effect} />)}
    </Container>
  }
}

export { World }