Basic .io game example with SocketIO and ReactJS
===========================================

<h2>Content</h2>

This is a basic .io game example to show the concept around it. I've used React for the UI since is the current library that I'm working on, this can be replaced with the lib/framework that you like.

You can try a running example of this code on [this codesandbox](https://codesandbox.io/s/socketio-react-io-game-g53v1).

<h2>How to run</h2>

1. Do an **npm install** in both client/server folders.
2. Run **npm run start** in both client/server folders.


<h2>Structure</h2>

* Server
    
    *./src/index.ts*: The server features only one file where we have all the declarations for the connections and game logic.

* Client
    
    *./src/components*:
    1. *Container*: Fixed size SVG Container where all the drawing will occour.
    2. *Player*: Black SVG circle that will behave as a Player instance.
    3. *Effect*: Black SVG circle that will behave as a projectile thrown by the player.

    *./src/views*: There is only one view where we have all the connection and game logic for the frontend.


<h2>Game Events</h2>
    
**server -> client**

    login_success: 
        desc: Sent to the player as confirmation of a successful connection to the game. 
        payload: { self: Player, players: Player[] }
    

    player_join: 
        desc: Sent to all the other players when a new player connects to the game.
        payload: { player: Player }


    player_leave
        desc: Sent to all the other players when a player leaves the game.
        payload: { id: string }


    update
        desc: Sent to all the players at every tick of the server (setInterval).
        payload: { players: Player[], effects: Effect[] }

**client -> server**

    request_direction_change:
        desc: Sent by the player when a direction key is pressed or released.
        payload: { x: number, y: number }

    request_shoot:
        desc: Sent by the player when the Space bar key is pressed.
        payload: {}

