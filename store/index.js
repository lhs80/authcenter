import {action, observable} from 'mobx'
import {useStaticRendering} from 'mobx-react'

const isServer = typeof window === 'undefined';
useStaticRendering(isServer)

export class UserInfo {
	@observable lastUpdate = 0;
	@observable light = false;
	@observable userInfo = {};

	// hydrate(serializedStore) {
	// 	this.lastUpdate =
	// 		serializedStore.lastUpdate != null
	// 			? serializedStore.lastUpdate
	// 			: Date.now()
	// 	this.light = !!serializedStore.light
	// }

	@action start = () => {
		// this.timer = setInterval(() => {
		// 	this.lastUpdate = Date.now()
		// 	this.light = true
		// }, 1000)
	};

	@action setUserInfo = (value) => {
		this.userInfo = value;
	};
}

export async function fetchInitialStoreState() {
	return {}
}
