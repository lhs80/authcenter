import React, {Component} from 'react';
import Router from 'next/router'
import Layout from 'components/Layout/login'
import {Tabs} from 'antd'
import cookie from 'react-cookies' //操作cookie
import LoginByPassword from './components/LoginByPassword' //手机密码登录 分开写为了实现输入框的单独校验
import LoginBySmsCode from './components/LoginBySmsCode'   //验证码登录 分开写为了实现输入框的单独校验
import './components/style.less'

const TabPane = Tabs.TabPane;
let timer = null;

class LoginIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {
			passWordLogin: true,
			sessionId: '',
			createTime: '',
			info: {},
			seconds: 0,
			computerLogin: 1,
			codeError: true
		}
	}

	componentDidMount() {
		if (cookie.load('_mobile_')) {
			Router.push('/')
		}
	}

	//密码登录
	passwordLogin = () => {
		this.setState({
			passWordLogin: true
		});
		//清除正在轮询的方法
		clearInterval(timer);
	};
	passLogin = () => {
		this.setState({
			passWordLogin: true
		});
		clearInterval(timer);
	};

	render() {
		return (
			<Layout title="登录" className="bg-white">
				<aside className="login-content">
					<div className="title">认证中心</div>
					<div className="login-content-form">
						<div className="login-content-form-top" style={{padding: '40px 0 54px 0'}}>
							<Tabs defaultActiveKey="1" size="large" tabBarStyle={{'border': 'none'}} tabBarGutter={88} style={{padding: '0 40px'}}>
								<TabPane tab="密码登录" key="1">
									<LoginByPassword history={this.state.redirectUrl} />
								</TabPane>
								<TabPane tab="验证码登录" key="2">
									<LoginBySmsCode history={this.state.redirectUrl} />
								</TabPane>
							</Tabs>
						</div>
					</div>
				</aside>
			</Layout>
		)
	}
}

export default LoginIndex;
