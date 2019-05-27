import React, { Component } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import './styles/Horiscroll.css';


const Arrow = ({ text, className }) => {
  return (
    <div
      className={className}
    >{text}</div>
  );
};


const ArrowLeft = Arrow({ text: '<<', className: 'arrow-prev' });
const ArrowRight = Arrow({ text: '>>', className: 'arrow-next' });

//  index
class Horiscroll extends Component {
  state = {
    selected: 0
  };
  
  onSelect = key => {
    this.setState({ selected: key });
  }

  
  render() {
    const { selected } = this.state;
    // Create menu from items
    const menu = this.props.data(selected);

    return (
      <div className="App">
        <ScrollMenu
          data={menu}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          selected={this.state.selected}
          onSelect={this.onSelect}
        />
      </div>
    );
  }
}

export default Horiscroll;

