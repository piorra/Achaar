// basic stuff
import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
// theme and UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {palette} from './utils/';
// routes
import HomePage from './pages/homePage';
import SignUp from './pages/signup';
import SignIn from './pages/signin';
import ProductPage from './pages/product-page';
import ShoppingCart from './pages/cart';
import LogoutFromAccount from './pages/account-logout';
import DeleteAccount from './pages/delete-account';
import Category from './pages/category';
// misc
import './styles/index.scss';
import registerServiceWorker from './registerServiceWorker';


// The story begins...😃

console.log('👌🔧');
class App extends React.Component {
    render() {
        return (
            <Router>
                <MuiThemeProvider muiTheme={getMuiTheme({
                    isRtl: true,
                    palette,
                    fontFamily: 'inherit',
                    slider: {
                        trackSize: 2,
                        trackColor: '#dedede',
                        trackColorSelected: '#dedede',
                        handleColorZero: '#dedede',
                        selectionColor: palette.accent1Color,
                        rippleColor: '#000'
                    },
                    toggle: {
                        trackOffColor: '#aaa',
                        thumbOffColor: '#d9d9d9',
                        trackOnColor: palette.accent3Color,
                        thumbOnColor: palette.accent1Color
                    }
                })}>
                    <React.Fragment>
                        {/* Index */}
                        <Route path="/" exact component={HomePage} />
                        {/* Account */}
                        <Route path='/signup' exact component={SignUp} />
                        <Route path='/signin' exact component={SignIn} />
                        {/* Products */}
                        <Route exact path='/category/:name' component={Category} />
                        <Route path='/product/:id' render={({match}) => <ProductPage pid={match.params.id} />} exact />
                        {/* Cart */}
                        <Route exact path='/cart' component={ShoppingCart} />
                        {/* Account managing */}
                        <Route exact path='/account/logout' component={LogoutFromAccount} />
                        <Route exact path='/account/delete-account' component={DeleteAccount} />
                    </React.Fragment>
                </MuiThemeProvider>
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))

registerServiceWorker();
