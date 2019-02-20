import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      // remote
      // endpoint: 'walkertrekker.herokuapp.com',
      // playerId: 'ec8b81d6-ae17-4de9-99ca-fe007f71f731',
      // local
      endpoint: 'localhost:5000',
      playerId: '7dd089c0-7f4b-4f39-a662-53554834a8f7',
    }
  }

  componentDidMount() {
    const client = io(this.state.endpoint)
    client.connect()
    client.on('connect', () => {
      console.log('Emiting findPlayerInfo event')
      client.emit('getPlayerInfo', this.state.playerId)
    })
    client.on('sendPlayerInfo', (player) => {
      console.log('playerInfoFound event received, data: ')
      console.log(player)
      this.setState({ player })
      if (player.inActiveGame) {
        client.emit('getCampaignInfo', player.campaignId)
      }
    })
    client.on('sendCampaignInfo', (campaign) => {
      console.log('campaignInfoFound event received, data: ')
      console.log(campaign)
      this.setState({ campaign, ready: true })
    })
    client.on('log', (msg) => {
      console.log(msg)
    })
  }

  componentWillUnmount() {
    const client = io(this.state.endpoint)
    client.emit('disconnect')
  }

  render() {
    if (this.state.ready) {
      const active = this.state.player.inActiveGame ? 'Yes' : 'No'
      return (
        <div>
          <ul>
            <li> Player ID: {this.state.playerId} </li>
            <li> Display Name: {this.state.player.displayName} </li>
            <li> In Active Game: {active} </li>
            <li> Campaign ID: {this.state.player.campaignId} </li>
            <li> Start Date: {this.state.campaign.startDate} </li>
            <li> Campaign Length: {this.state.campaign.length} </li>
            <li> Party Food Items: {this.state.campaign.inventory.foodItems} </li>
            <li> Party Medicine Items: {this.state.campaign.inventory.medicineItems} </li>
            <li> Party Weapon Items: {this.state.campaign.inventory.weaponItems} </li>
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
      return (<div>Fetching data...</div>)
    }
  }

}

export default App;
