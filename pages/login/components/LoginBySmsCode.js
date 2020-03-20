//验证码登录
import React from 'react'
import Router, {withRouter} from 'next/router';
import {Button, Col, Form, Icon, Input, Row, Divider} from 'antd';
import Link from 'next/link';
import cookie from 'react-cookies' //操作cookie
import {validatePhone, checkPhone} from 'config/regular'
import {loginIn, sendSmsCode} from 'server'
import {iconUrl} from 'config/evn'
import axios from 'config/http'

const FormItem = Form.Item;
let captchaIns = null;

class LoginBySmsCode extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			mobile: '',
			captchaCode: '',
			count: 60,
			isSmsSended: false,
			tipText: '发送验证码'
		};
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
					if (err) return  // 当验证失败时，内部会自动refresh方法，无需手动再调用一次
					let params = {
						mobile: self.props.form.getFieldValue('mobile'),
						smsCode: self.props.form.getFieldValue('captchaCode'),
						validate: data.validate,
						source: cookie.load('_source_'),
						loginType: 2
					};

					loginIn(params).then(res => {
						if (res.result === 'success') {
							const expires = new Date();
							expires.setDate(expires.getDate() + 3);
							cookie.save('_mobile_', res.data.mobile, {expires, path: '/'});
							cookie.save('_source_', cookie.load('_source_'), {expires, path: '/'});
							Router.push({pathname: '/'});
						} else {
							if (res.msg === '账户不存在！') {
								self.props.form.setFields({
									mobile: {
										value: self.props.form.getFieldValue('mobile'),
										errors: [new Error(res.msg)],
									},
								});
							} else {
								self.props.form.setFields({
									captchaCode: {
										value: self.props.form.getFieldValue('captchaCode'),
										errors: [new Error(res.msg)],
									},
								});
							}
							captchaIns && captchaIns.refresh()
						}
					});
				}
			}, function onload(instance) {
				// 初始化成功
				captchaIns = instance
			}, function onerror(err) {
				// 验证码初始化失败处理逻辑，例如：提示用户点击按钮重新初始化
			})
		}

	};

	handleSubmitByCode = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				captchaIns && captchaIns.verify();
			}
		});
	};

	SendSmsCodeFun() {
		let params = {
			mobile: this.props.form.getFieldValue('mobile')
		};
		sendSmsCode(params).then(res => {
			if (res.result === 'success') {
				this.setTime();
				this.setState({
					isSmsSended: true,
				});
			}
		})
	}

	setTime() {
		let self = this;
		if (this.state.isSmsSended) return;
		let count = this.state.count;
		const timer = setInterval(function () {
			self.setState({
				count: (--count),
			});
			if (count === 0) {
				clearInterval(timer);
				self.setState({
					isSmsSended: false,
					count: 60,
					tipText: '重新发送'
				})
			}
		}, 1000);
	}

	render() {
		const {getFieldDecorator, getFieldError} = this.props.form;

		const BtnGroup = this.state.isSmsSended
			?
			<Button size="large" type="link" className="btn-sendCode">重新发送{this.state.count}s</Button>
			:
			<Button size="large" type="link" className="btn-sendCode"
			        disabled={getFieldError('mobile') || !this.props.form.getFieldValue('mobile')}
			        onClick={this.SendSmsCodeFun.bind(this)}>{this.state.tipText}</Button>;
		return (
			<Form onSubmit={this.handleSubmitByCode} className="login-form mt5">
				<FormItem>
					{getFieldDecorator('mobile', {
						rules: [
							{required: true, message: '请输入手机号'},
							{validator: validatePhone}
						]
					})(
						<Input maxLength={11} size="large" placeholder="请输入手机号" />
					)}
				</FormItem>
				<FormItem>
					<Row gutter={10}>
						<Col span={24}>
							{getFieldDecorator('captchaCode', {
								rules: [{required: true, message: '请输入手机验证码!', whitespace: true,}],
							})(
								<Input maxLength={4} size="large" placeholder="请输入手机验证码" suffix={BtnGroup} />
							)}
						</Col>
					</Row>
				</FormItem>
				<Button size="large" block type="primary" htmlType="submit" className="login-form-button">登录</Button>
			</Form>
		)
	}
}


LoginBySmsCode = Form.create()(LoginBySmsCode);
export default withRouter(LoginBySmsCode);
