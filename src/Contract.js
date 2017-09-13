import React, { Component } from 'react';
import logo from './grappa.jpg';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Contract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completionEta: "",
      supervision: "",
      misc: ""
    }
  }

  componentDidMount() {
    document.title = "Grappa: Contract page";
  }

  handleContractChange = (event) => {
    console.log("handler called " + event.target.name + " " + event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  sendForm = (event) => {
    axios.post('/api/contract',{
      completionEta: this.state.completionEta,
      supervision: this.state.supervision,
      misc: this.state.misc
    })
      .then((resp) => {
      console.log(resp)
    })
    .catch((error) => {console.error(error)});
    console.log("Nappia painettiin.");
  }

  render() {
    return (
    <div className="App">

        <div className="ui inverted segment">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Thesis Contract</h2>
        </div>

        <div className="ui segment">
            <h2>Gradusopimus tehdään gradunohjauksen alkaessa</h2>
            <h3>Sopimusta voidaan muuttaa osapuolten yhteisestä päätöksestä.</h3>

            <div className="ui form">
                <form onSubmit={this.handlePost}>
                    <div className="field">
                        <label>Gradun valmistumisen ajankohta</label>
                        <textarea ref="input" rows="2" placeholder="arvioitu gradun valmistumisen aikataulu" type="text" name="completionEta" value={this.state.completionEta} onChange={this.handleContractChange} />
                    </div>
                    <div className="field">
                        <label>Ohjaus</label>
                        <textarea ref="input" rows="2" placeholder="ohjauksen määrän ja laadun yksityiskohdat" type="text" name="supervision" value={this.state.supervision} onChange={this.handleContractChange} /> <br />
                    </div>
                    <div className="field">
                        <label>Muu</label>
                        <textarea ref="input" rows="2" placeholder="muut sovittavat asiat" type="text" name="misc" value={this.state.misc} onChange={this.handleContractChange} /> <br />
                    </div>
                    <button className="ui primary button" type="submit" onClick={this.sendForm}>Save</button>
                </form>
            </div>
            <br />
            <Link to="/"> Go back to HomePage :P </Link>
        </div>
    </div>
    );
  }
}

export default Contract;
