import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import qs from 'querystringify';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
// import Paper from 'material-ui/Paper';
import {palette} from '../utils/'


const data = [
    {
        name: 'آچار فرانسه',
        price: 50000
    },
    {
        name: 'آچار فرانسه',
        price: 4000
    },
    {
        name: 'آچار فرانسه',
        price: 300000
    },
    {
        name: 'آچار فرانسه',
        price: 1000
    },
    {
        name: 'آچار فرانسه',
        price: 8420
    },
    {
        name: 'آچار فرانسه',
        price: 50000
    }
]

export default class Category extends Component {
    render(){
        const {history, match} = this.props;
        const category = match.params.name;
        const _query = {
            min: 0,
            max: Infinity,
            filter: ''
        }
        const urlQuery = qs.parse(history.location.search);
        const query = Object.assign(_query, urlQuery);
        return (
            <Fragment>
                {/* <div>کتگوری: <b>{match.params.name}</b></div>
                <div>حداقل قیمت: <b>{qs.parse(history.location.search).min}</b></div> */}
                <AppBar title={category} zDepth={2} iconElementLeft={
                    <Link to='/'>
                        <IconButton>
                            <FontIcon className='mdi' color={palette.primary3Color}>arrow_forward</FontIcon>
                        </IconButton>
                    </Link>
                } />
                {data.filter(p => {
                    return p.price >= Number(query.min) && Number(query.max) >= p.price && p.name.indexOf(query.filter) !== -1
                }).map((e, index) => {
                    return <div key={index}>
                        <b>{e.name}</b>
                        <br />
                        <b>{e.price}</b>
                    </div>
                })}
            </Fragment>
        )
    }
}