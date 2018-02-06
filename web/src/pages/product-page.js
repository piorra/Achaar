import React, {Component} from 'react';
import {Space, palette, slicePrice, numToFA, cookie, resolveApiURL} from '../utils/';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import ReactStars from 'react-stars';
import {Tab, Tabs} from 'material-ui/Tabs';
import {
    Table, TableRow, TableBody, TableRowColumn
} from 'material-ui/Table';
import SwipeableViews from 'react-swipeable-views';
import {Link} from 'react-router-dom';
import Helmet from 'react-helmet';
import axios from 'axios';

const commentData = [
    {
        author: 'نظرده سوم',
        text: 'خیلی بده\nاصلا از آچار این انتظارو نداشتم',
        title: 'خیلی بده',
        time: new Date().toLocaleTimeString('fa-ir'),
        date: new Date().toLocaleDateString('fa-ir'),
        rate: 0
    },
    {
        author: 'نظرده دوم',
        text: 'نظر نداره :(',
        title: 'نظری ندارم',
        time: new Date().toLocaleTimeString('fa-ir'),
        date: new Date().toLocaleDateString('fa-ir'),
        rate: 50
    },
    {
        author: 'نظرده اول',
        text: 'خیلی جــــــــالب و جــــــذابه',
        title: 'واقعا خوبه',
        time: new Date().toLocaleTimeString('fa-ir'),
        date: new Date().toLocaleDateString('fa-ir'),
        rate: 89
    },
]

const Comments = (props) => {
    let result = [];
    const rateFullStars = (num) => {
        let fulls = Number(num[0]),
        halfs = Number(num[1]);
        let f = [];
        for (var i = 0; i < (fulls == 0 ? 4 : fulls); i++) {
            f.push(<i className='mdi'>{fulls == 0 ? 'star_border' : 'star'}</i>)
        }
        f.push(<i className='mdi'>{halfs >= .5 ? 'star_half' : 'star_border'}</i>)
        return f;
    }
    for (var i = 0; i < props.data.length; i++) {
        let comment = props.data[i];
        result.push(<div key={i} className='comment'>
            <div className='comment-bubble'>
                <div style={{fontSize: '1.25em'}} className='comment-title'>{comment.title}</div>
                <div className='comment-author' style={{fontSize: '.8em', opacity: .65}}><i className='mdi'>person</i> {comment.author}</div>
                <div className='comment-text'>{comment.text}</div>
                <div className='comment-metadata' style={{fontSize: '.8em', opacity: .65, textAlign: 'left'}}>
                    {comment.time} | {comment.date}
                </div>
                {comment.rate != null && <div className='comment-rating' style={{direction: 'ltr', fontSize: '.8em', opacity: .75}}>
                    {rateFullStars((Math.round(comment.rate / 20 * 2) / 2).toFixed(1).toString().split('.'))}
                </div>}
            </div>
        </div>)
    }
    return result;
}

export default class ProductPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeTab: 0,
            commentDialogOpen: false,
            loaded: false
        }
    }
    componentDidMount(){
        let $ = this;
        axios({
            method: 'post',
            url: resolveApiURL('product'),
            data: {product:$.props.pid}
        }).then(res => {
            $.setState({loaded: true})
            console.log(res);
        })
    }
    handleChangeTab = value => {
        this.setState({
            activeTab: value
        })
    }

    auth = cookie.get('AS_AUTH')

    render(){
        let {props} = this;
        let di = {
            close(){
                this.setState({commentDialogOpen: false})
            },
            open(){
                this.setState({commentDialogOpen: true})
            }
        }
        if (this.state.loaded) {
            return (
            <div className='container' style={{padding: 0}}>
                <Helmet>
                    <title>{`${props.productName} | آچار`}</title>
                </Helmet>
                <AppBar zDepth={2} title={props.productName} iconElementLeft={<IconButton><Link draggable={false} to='/'><FontIcon className='mdi' color={palette.primary3Color}>arrow_forward</FontIcon></Link></IconButton>} style={{flexWrap: 'wrap', position: 'fixed', right: 0}} iconElementRight={
                    this.auth &&
                    <Link to='/cart'>
                        <IconButton>
                            <FontIcon color={palette.primary3Color} className='mdi'>shopping_cart</FontIcon>
                        </IconButton>
                    </Link>
                }>
                    <Tabs onChange={this.handleChangeTab} value={this.state.activeTab} style={{width: 'calc(100% + 48px)', marginLeft: -24, marginRight: -24}}>
                        <Tab label='معرفی' value={0} />
                        <Tab label="مشخصات فنی" value={1} />
                        <Tab label="نظرات کاربران" value={2} />
                    </Tabs>
                </AppBar>
                <Space height={127} />
                <SwipeableViews animateHeight index={this.state.activeTab} animateHeight={false} onChangeIndex={this.handleChangeTab} enableMouseEvents axis='x-reverse'>
                    <Paper style={{margin: '7px 22px'}} zDepth={2}>
                        <div className='clear' style={{direction: 'rtl'}}>
                            <div className='col-xs-12 col-md-6'>
                                <Space height={1} />
                                {/* Pictures! */}
                            </div>
                            <div className='col-xs-12 col-md-6'>
                                <h2>{props.productName}</h2>
                                <div style={{fontSize: '1.25em'}}>
                                    <p style={{color: '#585858'}}>
                                        <i className='mdi'>security</i> گارانتی: <b style={{color: '#000'}}>شخمه صنعت پرداز غرب</b>
                                        <br />
                                        <i className='mdi'>attach_money</i> قیمت:
                                        <b style={{color: palette.accent2Color}}> {slicePrice(numToFA(410000))} تومان</b>
                                    </p>
                                    {this.auth ?
                                        <div style={{margin: 20}}>
                                            <RaisedButton fullWidth={true} label='افزودن به سبد خرید' secondary={true}>
                                                <FontIcon className='mdi' color='#fff'>add_shopping_cart</FontIcon>
                                            </RaisedButton>
                                        </div>
                                    :
                                    <div className='unselectable' style={{margin: 20, color: palette.primary3Color, fontSize: 14, padding: 5, textAlign: 'center', backgroundColor: '#eaeaea', borderRadius: 2, cursor: 'default'}}>
                                        برای سفارش کالا برای وارد سایت شوید.
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </Paper>
                    <div style={{padding: 15, direction: 'rtl'}}>
                        <Table selectable={false} multipleSelectable={false}>
                            <TableBody displayRowCheckbox={false}>
                                <TableRow>
                                    <TableRowColumn>نام کامل</TableRowColumn>
                                    <TableRowColumn>{props.productName}</TableRowColumn>
                                </TableRow>
                                {/* Other properties... Waiting for the API :) */}
                            </TableBody>
                        </Table>
                    </div>
                    <div style={{padding: 15, paddingRight: 30, direction: 'rtl'}}>
                        <Comments data={commentData} />
                    </div>
                </SwipeableViews>

                {this.auth &&
                    <React.Fragment>
                        <FloatingActionButton secondary={true} style={{
                            position: 'fixed', right: 25, bottom: 25, zIndex: 1100, transform: `scale(${this.state.activeTab == 2 ? 1 : 0}) rotate(${this.state.activeTab * 90 - 180}deg)`, opacity: this.state.activeTab == 2 ? 1 : .4
                        }} onClick={di.open.bind(this)}>
                            <FontIcon className='mdi'>edit</FontIcon>
                        </FloatingActionButton>


                        <FloatingActionButton backgroundColor={palette[`primary${this.state.activeTab == 2 ? 2 : 1}Color`]} style={{position: 'fixed', right: 25, bottom: this.state.activeTab == 2 ? 96 : 25, zIndex: 1100}}>
                            <FontIcon className='mdi'>add_shopping_cart</FontIcon>
                        </FloatingActionButton>


                        <Dialog contentStyle={{width: 'calc(100% - 50px)', maxWidth: 'none'}} modal={true} title={`دیدگاه شما درباره ${props.productName}`} open={this.state.commentDialogOpen} modal={false} autoScrollBodyContent={true} onRequestClose={di.close.bind(this)} actions={[
                            <FlatButton secondary={true} label='ارسال دیدگاه' onClick={di.close.bind(this)} />,
                            <FlatButton secondary={true} onClick={di.close.bind(this)} label='لغو' />
                        ]}>
                            {this.state.commentDialogOpen &&
                                <React.Fragment>
                                    <div style={{textAlign: 'center'}}>
                                        <TextField floatingLabelText='عنوان دیدگاه شما' autoFocus />
                                    </div>
                                    <TextField multiLine floatingLabelText='دیدگاه خود را بنویسید...' rows={2} fullWidth={true} />
                                    <Space height={15} />
                                    <div style={{direction: 'ltr', textAlign: 'center'}}>
                                        <ReactStars size={40} color1='#aaa' color2={palette.accent2Color} className='mdi unselectable' char='star' />
                                    </div>
                                </React.Fragment>
                            }
                        </Dialog>
                    </React.Fragment>
                }
            </div>
        )
        } else {
            return (<div>Loading...</div>)
        }
    }
}
