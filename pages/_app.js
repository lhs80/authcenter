import App from 'next/app'
import React from 'react'
import {fetchInitialStoreState, UserInfo} from 'store'
import {Provider} from 'mobx-react'

class AuthCenterApp extends App {
	state = {
		store: new UserInfo(),
	};

	// Fetching serialized(JSON) store state
	static async getInitialProps(appContext) {
		const appProps = await App.getInitialProps(appContext);
		const initialStoreState = await fetchInitialStoreState();

		return {
			...appProps,
			initialStoreState,
		}
	}

	// Hydrate serialized state to store
	// static getDerivedStateFromProps(props, state) {
	// 	state.store.hydrate(props.initialStoreState)
	// 	return state
	// }

	render() {
		const {Component, pageProps} = this.props;
		return (
			<Provider store={this.state.store}>
				<Component {...pageProps} />
			</Provider>
		)
	}
}

export default AuthCenterApp
