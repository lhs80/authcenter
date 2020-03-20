//手机密码登录
import React from 'react'
import {Button, Col, Form, Icon, Input, Row, Divider} from 'antd';
import Router, {withRouter} from 'next/router';
import cookie from 'react-cookies' //操作cookie
import md5 from 'blueimp-md5'
import {loginIn} from 'server'
import {validatePhone} from 'config/regular'

const FormItem = Form.Item;
let captchaIns = null;

class LoginByPassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mobile: '',
			password: '',
			showMobileError: false,
			showPswError: false,
			token: ''
		}
	}

	componentDidMount() {
		this.initCaptcha();
	}

	initCaptcha = () => {
		let self = this;
		if (initNECaptcha) {
			initNECaptcha({
				captchaId: '1f7484c06f8846d3b0aa324f6e59bbec',
				element: '#captcha',
				mode: 'bind',
				onReady: function (instance) {
					// 验证码一切准备就绪，此时可正常使用验证码的相关功能
				},
				onVerify: function (err, data) {
					/**
					 * 第一个参数是err（Error的实例），验证失败才有err对象
					 * 第二个参数是data对象，验证成功后的相关信息，data数据结构为key-value，如下：
					 * {
					 *   validate: 'xxxxx' // 二次验证信息
					 * }
					 **/
					if (err) return; // 当验证失败时，内部会自动refresh方法，无需手动再调用一次
					let params = {
						mobile: self.props.form.getFieldValue('mobile'),
						password: md5(self.props.form.getFieldValue('password')),
						validate: data.validate,
						source: cookie.load('_source_'),
						loginType: 1
					};

					loginIn(params).then(res => {
						if (res.result === 'success') {
							const expires = new Date();
							expires.setDate(expires.getDate() + 3);
							cookie.save('_mobile_', res.data.mobile, {expires, path: '/'});
							cookie.save('_source_', cookie.load('_source_'), {expires, path: '/'});
							Router.push({pathname: '/'});
						} else {

							self.props.form.setFields({
								password: {
									value: self.props.form.getFieldValue('password'),
									errors: [new Error(res.msg)],
								},
							});

							captchaIns && captchaIns.refresh()
						}
					});
				}
			}, function onload(instance) {
				// 初始化成功
				captchaIns = instance
			}, function onerror(err) {
				captchaIns = instance
				// 验证码初始化失败处理逻辑，例如：提示用户点击按钮重新初始化
			})
		}
	};

	/*
	* 提交表单
	*/
	handleSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				captchaIns && captchaIns.verify();
			}
		});
	}

	render() {
		const {getFieldDecorator} = this.props.form;
		return (
			<Form onSubmit={this.handleSubmit.bind(this)} className="login-form mt5">
				<FormItem>
					{getFieldDecorator('mobile', {
						rules: [
							{required: true, message: '请输入手机号码'},
							{validator: validatePhone}
						],
					})(
						<Input size="large" maxLength={11} placeholder="请输入手机号" />
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('password', {
						validateTrigger: 'onBlur',
						rules: [
							{required: true, message: '请输入密码'},
							{max: 20, message: '密码长度6-20'},
							{min: 6, message: '密码长度6-20'},
						],
					})(
						<Input size="large" maxLength={20} type="password" placeholder="请输入登录密码" />
					)}
				</FormItem>
				<Button size="large" block type="primary" htmlType="submit" id="captcha" className="login-form-button">登录</Button>
			</Form>
		)
	}
}

LoginByPassword = Form.create()(LoginByPassword);
export default withRouter(LoginByPassword);
