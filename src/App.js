import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      endpoint: 'localhost:5000',
      playerId: '7dd089c0-7f4b-4f39-a662-53554834a8f7',
    }
  }

  componentDidMount() {
    const client = io(this.state.endpoint)
    client.connect()
    client.on('connect', () => {
      console.log('Emiting findPlayerInfo event')
      client.emit('findPlayerInfo', this.state.playerId)
    })
    client.on('playerInfoFound', (player) => {
      console.log('playerInfoFound event received, data: ')
      console.log(player)
      this.setState({ player })
      if (player.inActiveGame) {
        client.emit('findCampaignInfo', player.campaignId)
      } else {
        this.setState({ ready: true })
      }
    })
    client.on('campaignInfoFound', (campaign) => {
      console.log('campaignInfoFound event received, data: ')
      console.log(campaign)
      this.setState({ campaign, ready: true })
    })
    client.on('log', (data) => {
      console.log(data)
    })
  }

  render() {
    if (this.state.ready) {
      return (
        <div>
          <ul>
            <li> Player ID: {this.state.playerId} </li>
            <li> Display Name {this.state.player.displayName} </li>
            <li> In Active Game {this.state.player.inActiveGame} </li>
            <li> Campaign ID: {this.state.player.campaignId} </li>
            <li> Start Date: {this.state.campaign.startDate} </li>
            <li> Campaign Length: {this.state.campaign.length} </li>
            <li> Players:
              <ul>
                {this.state.campaign.players.map(player => {
                  return (
                    <li key={player.id}>{player.displayName}</li>
                  )
                })}
              </ul>
            </li>
          </ul>
        </div>
      );
    }
    else {
      return (<div>Waiting...</div>)
    }
  }

}

export default App;
