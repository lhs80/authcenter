import React from 'react'
import Router from 'next/router'
import {Row, Col, Button, Avatar} from 'antd'
import cookie from 'react-cookies' //操作cookie
import {getUserInfoFun} from 'server'
import './style.less'
import {observer, inject} from 'mobx-react'
import {baseUrl} from 'config/evn'

@inject('store')
@observer
export default class CommonHeaderIndex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mobile: cookie.load('_mobile_'),
			userInfo: {}
		}
	}

	componentDidMount() {
		this.queryUserInfo();
	}

	/**
	 * 查询用户信息
	 * */
	queryUserInfo() {
		if (this.state.mobile) {
			let params = {
				mobile: this.state.mobile,
				source: cookie.load('_source_')
			};
			getUserInfoFun(params).then(res => {
				if (res.result === 'success') {
					this.props.store.setUserInfo(res.data);
					this.setState({
						userInfo: res.data
					})
				}
			})
		}
	}

	/**
	 * 退出
	 * 清空缓存
	 * */
	loginOut = () => {
		cookie.remove('_mobile_', {path: '/'});
		// cookie.remove('_source_', {path: '/'});
		Router.push('/login/index')
	};

	render() {
		const {userInfo} = this.state;
		return (
			<div className="common-header">
				<Row className="common-header-content">
					<Col span={12}>
						<span className="text-darkgrey">您好，欢迎来到工品行认证中心！</span>
						<span className="text-darkgrey">{this.state.mobile || ''}</span>
						<span><Button type="link" className="text-lightgrey" onClick={this.loginOut}>退出</Button></span>
					</Col>
					<Col span={12} className='text-right'>
						<Avatar size={32} src={userInfo.headUrl ? baseUrl + userInfo.headUrl : `/static/images/cus-header.png`} />
						<span className="prl1 text-darkgrey">{userInfo.nickName}</span>
					</Col>
				</Row>
			</div>
		)
	}
}
