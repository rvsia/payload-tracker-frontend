import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropdownContainer from './DropdownContainer';
import { Chip, Button, TextInput } from '@patternfly/react-core';

const ChipContainer = props => {
  return(
    <div style={{float:'right'}}>
      {props.filters.map(chip =>
        <React.Fragment>
          <Chip key={chip.id} onClick={() => props.closeChip(chip.id)}>
            {chip.key + '=' + chip.value}
          </Chip>
        </React.Fragment>
      )}
    </div>
  )
}

class SearchBar extends Component {

  constructor(){
    super()
    this.state = {
      filterCount: 0,
      filterInputOpen: false,
      newValue: '',
      payload_id: '',
      isOpen: false,
    }
  }

  setSelected = (filterType, filterValue) => {
    this.props.updateParameters({name: filterType, value: filterValue})
  }

  openFilterInput = (type, item) => {
    this.setState({
      filterInputOpen: true,
      newFilter: item,
    })
  }

  createChip = () => {
    var {filterCount, newFilter, newValue} = this.state
    if (newValue !== '' && newFilter !== ''){
      this.props.filters.push({id: filterCount, key: newFilter, value: newValue})
      this.setState({
        filterCount: this.state.filterCount + 1,
        filterInputOpen: false,
        newFilter: '',
        newValue: '',
      })
      this.props.buildQuery()
    }
  }

  closeChip = (id) => {
    for(var i = 0; i < this.props.filters.length; i++) {
      if(this.props.filters[i].id === id){
          this.props.filters.splice(i,1)
      }
    }
    this.props.buildQuery()
  }

  handlePayloadIDInputChange = payload_id => {
      this.setState({
          payload_id
      })
  }

  handleNewValueInputChange = newValue =>{
    this.setState({
        newValue
    })
  }

  submitQuery = () => {
    if (this.state.payload_id !== ''){
      this.props.buildQuery(this.state.payload_id)
    }
  }

  render() {
  return (
    <div style={{margin: '10px'}}>

      <TextInput
        isRequired
        type="text"
        name="payload_id"
        value={this.state.payload_id}
        onChange={this.handlePayloadIDInputChange}
        style={inputStyle}
        placeholder='Enter Payload ID...'
      />
      <Button variant='primary' onClick={(e) => {this.submitQuery()}}> 
            Submit
      </Button>

      <DropdownContainer 
        items={['service', 'source', 'account', 'payload_id',
        'inventory_id', 'system_id', 'status',
        'status_msg', 'date', 'created_at']}
        type="Sort By"
        setSelected={this.setSelected}
      />

      <DropdownContainer 
        items={['asc', 'desc']}
        type="Sort Dir"
        setSelected={this.setSelected}
      />

      <DropdownContainer
        items={[
          'service', 'source', 'account', 'inventory_id', 
          'system_id', 'status', 'status_msg', 'date_lt', 
          'date_gt', 'date_lte', 'date_gte', 'created_at_lt',
          'created_at_gt', 'created_at_lte', 'created_at_gte']}
        type="Filter By"
        setSelected={this.openFilterInput}
      />

      <TextInput
        isRequired
        type='text'
        name='newValue'
        onChange={this.handleNewValueInputChange}
        style={this.state.filterInputOpen ? {
          width: '150px',
          marginLeft: '10px',
          marginRight: '10px'
        } : { display: 'none' }}
        placeholder={this.state.newFilter + '...'}
        value={this.state.newValue}
      />
      
      <Button
        variant='secondary'
        style={this.state.filterInputOpen ? {} : { display: 'none' }} 
        onClick={(e) => {this.createChip()}}>
        Enter
      </Button>

      <ChipContainer 
        filters={this.props.filters}
        closeChip={this.closeChip}
      />

    </div>
  );
  }

}

const inputStyle = {
  width: '90%',
  marginBottom: '10px',
  marginRight: '10px',
  boxSizing: 'border-box',
}

SearchBar.propTypes = {
  buildQuery: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  updateParameters: PropTypes.func.isRequired,
}

export default SearchBar;
