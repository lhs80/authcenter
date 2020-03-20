import React, {Component} from 'react';
import {checkIDNum} from 'config/regular';
import {Button, Form, Input, Radio, message, Modal} from 'antd';
import cookie from 'react-cookies';
import {registFun} from 'server'
import Router from 'next/router'

const FormItem = Form.Item;

class CompanyAuth extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mobile: cookie.load('_mobile_'),
			businessLicenseToggleRequire: true,//营业执照有效期和长期二选一
			legalPersonIdnumToggleRequire: true,//法人身份证有效期和长期二选一
			merchNo: '',
			loading: false
		};
	}

	componentDidMount() {
		// 如果不是未注册的用户进到页面，提示后，强制去结果页
		setTimeout(() => {
			if (this.props.userInfo.status !== -1) {
				Modal.info({
					title: '您已注册，请返回首页！',
					onOk() {
						Router.push({pathname: '/'})
					},
				});
			}
		}, 2000)
	}

	//取消认证
	cancelAuth = () => {
		Modal.confirm({
			title: '提示',
			content: '还差一点就要完成了，真的要放弃吗?',
			cancelText: '去意已决',
			okText: '我再想想',
			onCancel: () => {
				Router.push({pathname: '/'})
			}
		})
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) {
				return
			}
			this.setState({
				loading: true
			});

			let params = {
				...values,
				source: cookie.load('_source_'),
				mobile: this.state.mobile
			};
			registFun(params).then(res => {
				if (res.result === 'success') {
					Router.push({pathname: '/auth/second'})
				} else {
					this.setState({
						loading: false
					});
					message.error(res.msg);
				}
			})
		});
	};

	render() {
		const {loading} = this.state;
		const {getFieldDecorator} = this.props.form;
		const formItemLayout = {
			labelCol: {
				span: 9,
				offset: 0,
			},
			wrapperCol: {
				span: 15,
				offset: 0,
			},
		};
		return (
			<section>
				<Form
					{...formItemLayout}
					onSubmit={this.handleSubmit}
					style={{width: '800px', margin: 'auto'}}
					className="mt5">
					<FormItem label="企业名称">
						{getFieldDecorator('merchantName', {
							rules: [
								{required: true, message: '请输入营业执照上的公司名称'},
							]
						})(
							<Input style={{width: '300px', height: '50px'}} placeholder="请输入营业执照上的公司名称" />
						)}
					</FormItem>
					<FormItem label="企业类型">
						{getFieldDecorator('merchType', {
							initialValue: 'pcy',
							rules: [
								{required: true, message: '请输入营业执照上的公司名称'},
							],
						})(
							<Radio.Group onChange={this.setBusinessLicenceType}>
								<Radio value="pcy">个人工商户</Radio>
								<Radio value="com">企业</Radio>
							</Radio.Group>
						)}
					</FormItem>
					<FormItem wrapperCol={{span: 11, offset: 7}} className="text-right">
						<Button size="large" className="h3 mt2 bg-darkgrey text-primary" style={{width: '160px'}} onClick={this.cancelAuth}>取消认证</Button>
						<Button type="primary" size="large" htmlType='submit' className="h3 mt2" loading={loading} style={{width: '160px'}}>下一步</Button>
					</FormItem>
				</Form>
			</section>
		);
	}
}

const CompanyAuthForm = Form.create()(CompanyAuth);
export default CompanyAuthForm
