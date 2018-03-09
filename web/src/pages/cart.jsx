import React, {Component, Fragment} from 'react';
import Helmet from 'react-helmet';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {Link, Redirect} from 'react-router-dom';
import {palette, Space, slicePrice, numToFA, cookie, validateCookie} from '../utils/' ;
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import update from 'immutability-helper';

class CartItem extends Component {
    constructor(props){
        super(props);
    }
    state = {
        cddOpen: false,
    }
    cdClose = () => {
        this.setState({cddOpen: false});
    }
    render(){
        return (<tr {...this.props}>
            <td>{this.props.data.name}</td>
            <td>{numToFA(this.props.data.amount)}</td>
            <td>{slicePrice(numToFA(this.props.data.price))} تومان</td>
            <td>{slicePrice(numToFA(this.props.data.price * this.props.data.amount))} تومان</td>
            <td className='actions'>
                <div>
                    <IconButton tooltipPosition='top-center' tooltip='حذف آیتم از سبد خرید' onClick={() => {this.setState({cddOpen: true})}}>
                        <FontIcon className='mdi' color='#f44336'>
                            delete
                        </FontIcon>
                    </IconButton>
                    <IconButton tooltipPosition='top-center' tooltip='افزایش تعداد کالا' onClick={this.props.add}>
                        <FontIcon className='mdi' color={palette.accent1Color}>
                            add_circle_outline
                        </FontIcon>
                    </IconButton>
                    <IconButton tooltipPosition='top-center' tooltip='کاهش تعداد کالا' onClick={this.props.reduce} disabled={this.props.reducerDis}>
                        <FontIcon className='mdi' color={palette.accent2Color}>
                            remove_circle_outline
                        </FontIcon>
                    </IconButton>
                </div>
            </td>
            <Dialog modal={false} title={`حذف آیتم ${this.props.data.name}`} open={this.state.cddOpen} onRequestClose={this.cdClose} actions={[<FlatButton onClick={
                () => {
                    this.setState({cddOpen: false});
                    this.props.delete()
                }} secondary={true} autoFocus>بله</FlatButton>, <FlatButton secondary={true} onClick={this.cdClose}>خیر</FlatButton>] }>
                <b>{this.props.data.name}</b> حذف شود؟
            </Dialog>
        </tr>)
    }
}

export default class ShoppingCart extends Component {
    state = {
        items: [
            {
                name: 'آچار فرانسه',
                price: 41000,
                amount: 10
            },
            {
                name: 'آچار لندنی',
                price: 50000,
                amount: 1
            }
        ],
        confirmDialogOpen: false
    }
    changeAmount = (index, inc) => {
        let {items} = this.state;
        if (items[index].amount < 2 && inc < 0) {
            return;
        }
        const IO = {};
        let i = index.toString();
        IO[i] = {};
        IO[i].amount = {$set: items[index].amount + inc};
        let newItems = update(items, IO);
        return (() => {
            this.setState({
                items: newItems
            })
        }).bind(this)
    }
    deleteItem = (index) => {
        let {items} = this.state;
        let newItems = update(items, {
            $splice: [[index, 1]]
        })
        return (() => {
            this.setState({
                items: newItems
            })
        }).bind(this)
    }
    auth = validateCookie()
    render(){
        if (this.auth) {
            const closeD = () => {
                this.setState({confirmDialogOpen: false})
            }
            let fullPrice = 0;
            for (var i = 0; i < this.state.items.length; i++) {
                fullPrice += this.state.items[i].price * this.state.items[i].amount;
            }
            let finalize = () => {
                this.props.history.push({pathname: '/order-finalization'})
            }
            return (
                <Fragment>
                    <Helmet>
                        <title>سبد خرید | آچار</title>
                    </Helmet>
                    <Paper zDepth={1} style={{backgroundColor: palette.primary1Color, height: 256}}>
                        <AppBar titleStyle={{color: '#fff'}} style={{backgroundColor: 'transparent'}} title='سبد خرید' zDepth={0} iconElementLeft={<Link to='/'><IconButton><FontIcon className='mdi' color={palette.primary3Color}>arrow_forward</FontIcon></IconButton></Link>} />
                    </Paper>
                    <div className='col-xs-12 col-md-8' style={{position: 'relative', top: -56, float: 'none', margin: '0 auto'}}>
                        <Paper style={{padding: 15}} zDepth={1}>
                            <div style={{overflow: 'auto'}}>
                                {this.state.items.length > 0 ?
                                    <React.Fragment>
                                        <table className='cart-main'>
                                            <thead>
                                                <tr>
                                                    <th>نام</th>
                                                    <th>تعداد</th>
                                                    <th>قیمت واحد</th>
                                                    <th>قیمت کل</th>
                                                    <th>فعالیت ها</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.items.map((e, ind) => {
                                                    return <CartItem reducerDis={(e.amount < 2)} data={this.state.items[ind]} key={ind} reduce={this.changeAmount(ind, -1)} add={this.changeAmount(ind, 1)} delete={this.deleteItem(ind)} />
                                                })}
                                            </tbody>
                                        </table>
                                        <Space height={16} />
                                    </React.Fragment>
                                :
                                <div style={{textAlign: 'center', color: '#777', padding: 30}}>
                                    <i className='mdi' style={{fontSize: 100, color: palette.accent1Color}}>error_outline</i>
                                    <br />
                                    <b>سبد خرید شما خالی است :(</b>
                                </div>
                                }
                            </div>
                            {this.state.items.length > 0 ?
                                <div style={{textAlign: 'center', marginTop: 10}}>
                                    <big>
                                        قیمت کل:
                                        <big style={{color: palette.accent1Color}}><b> {slicePrice(numToFA(fullPrice))} تومان</b></big>
                                    </big>
                                    <Space height={15} />
                                    <div>
                                        <RaisedButton onClick={() => {
                                            this.setState({confirmDialogOpen: true})
                                        }} secondary label='نهایی‌سازی خرید' icon={<FontIcon className='mdi'>done</FontIcon>} />
                                    </div>
                                </div> : <React.Fragment></React.Fragment>
                            }
                        </Paper>
                    </div>

                    <Dialog title='تائید نهایی‌سازی خرید' open={this.state.confirmDialogOpen} onRequestClose={closeD} actions={[<FlatButton secondary={true} onClick={finalize}>بله</FlatButton>, <FlatButton secondary={true} onClick={closeD}>خیر</FlatButton>]}>
                        آیا از نهایی‌سازی خرید خود اطمینان دارید؟
                    </Dialog>
                </Fragment>
            )
        } else {
            return <Redirect to='/' />
        }
    }
}
