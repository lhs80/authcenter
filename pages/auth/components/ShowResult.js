import React, {Component} from 'react';
import {Button, Col, Divider, Icon, Row, Modal} from 'antd';
import Router from 'next/router';
import {getUserInfoFun, queryAccountStatusFun} from 'server'
import {iconUrl} from 'config/evn';
import './style.less'

const IconFont = Icon.createFromIconfontCN({
	scriptUrl: iconUrl,   //阿里巴巴图标引用地址
});

class ShowResult extends Component {
	constructor(props) {
		super(props);
		this.state = {
			companyInfo: this.props.userInfo
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.userInfo !== this.props.userInfo) {
			this.state = {
				companyInfo: this.props.userInfo
			}
		}
	}

	checkFaildReason = () => {
		let params = {
			merchNo: this.props.companyInfo.merchNo
		};
		queryAccountStatusFun(params).then(res => {
			if (res.result === 'success') {
				Modal.confirm({
					okButtonProps: {style: {display: 'none'}},
					title: '提示',
					content:
						<div>失败原因:{res.data.memo}</div>,
					cancelText: '我知道了'
				})
			}
		})
	};

	render() {
		const {companyInfo} = this.props;
		return (
			<section style={{overflow: 'hidden'}}>
				{/*未注册未认证*/}
				{
					companyInfo.status === -1 ?
						<aside>
							<div className=" text-center ptb3 mt6">
								<img src='/static/images/img-multi-account.png' alt="" className="mt6" />
								<h1 className="mt2 text-darkgrey">您尚未进行企业实名认证</h1>
							</div>
							<div className="text-center ptb6">
								<Button type="primary"
								        size="large"
								        style={{width: '300px'}}
								        onClick={() => {
									        Router.push('/auth/first')
								        }}
								>去认证</Button>
							</div>
						</aside>
						:
						null
				}
				{/*已注册未认证*/}
				{
					companyInfo.status === 0 ?
						<aside style={{paddingBottom: '80px'}}>
							<Row className="auth-tips error">
								<Col span={12}>
									<IconFont type="iconfont-shenhe" style={{color: '#29BCC8'}} className="large" />
									<b className="large prl1">未完成认证</b>
								</Col>
								<Col span={8} className="text-right">
									<Button type="primary"
									        style={{width: '100px', height: '40px'}}
									        onClick={() => {
										        Router.push('/auth/second')
									        }}>继续认证</Button>
								</Col>
							</Row>
							<div className="auth-result-wrapper">
								<div className="personalHead mt5">
									—— <span className="prl1">{companyInfo.merchantName}</span> ——
								</div>
								<Row className="prl3">
									<Col span={5}>
										{
											companyInfo.companyType === 'com' ?
												<div className="auth-result-type company">企业用户</div>
												:
												<div className="auth-result-type person">个体工商户</div>
										}
									</Col>
									<Col span={18}>
										<table style={{height: '80px', width: '100%'}} className="mt5">
											<tbody>
											<tr>
												<td style={{width: '140px'}} className="text-muted">法定代表人姓名</td>
												<td className="text-darkgrey">{companyInfo.legalPersonName}</td>
												<td style={{width: '140px'}} className="text-muted">法定代表人身份证号</td>
												<td className="text-darkgrey">{
													companyInfo.legalPersonIdnum ? companyInfo.legalPersonIdnum.substring(0, 2).padEnd(18, '*')
														:
														''
												}</td>
											</tr>
											</tbody>
										</table>
										<div className="mt4" />
									</Col>
								</Row>
							</div>
						</aside>
						:
						null
				}
				{/*已认证*/}
				{
					companyInfo.status === 2 ?
						<aside className="auth-result-wrapper">
							<div className="personalHead">
								—— <span className="prl1">{companyInfo.merchantName}</span> ——
							</div>
							<Row className="prl3">
								<Col span={5}>
									{
										companyInfo.companyType === 'com' ?
											<div className="auth-result-type company">企业用户</div>
											:
											<div className="auth-result-type person">个体工商户</div>
									}
								</Col>
								<Col span={18}>
									<table style={{height: '80px'}} className="mt6">
										<tbody>
										<tr>
											<td style={{width: '140px'}} className="text-muted">法定代表人姓名</td>
											<td className="text-darkgrey">{companyInfo.legalPersonName}</td>
										</tr>
										<tr>
											<td className="text-muted">法定代表人身份证号</td>
											<td className="text-darkgrey">{
												companyInfo.legalPersonIdnum ?
													companyInfo.legalPersonIdnum.substring(0, 2).padEnd(18, '*')
													:
													''
											}</td>
										</tr>
										</tbody>
									</table>
									<Divider className="mt5" />
									<table style={{height: '150px'}}>
										<tbody>
										<tr>
											<td style={{width: '140px'}} className="text-muted">营业执照类型</td>
											<td className="text-darkgrey">{companyInfo.businessLicenceType === '1' ? '三合一' : '普通'}</td>
										</tr>
										<tr>
											<td className="text-muted">营业地址</td>
											<td className="text-darkgrey">{companyInfo.address}</td>
										</tr>
										<tr>
											<td className="text-muted">营业执照注册号或<br />社会统一信用代码</td>
											<td className="text-darkgrey">{
												companyInfo.businessLicenceNo ?
													companyInfo.businessLicenceNo.substring(0, 4).padEnd(18, '*')
													:
													''
											}</td>
										</tr>
										<tr>
											<td className="text-muted">营业执照有效期</td>
											<td className="text-darkgrey">{companyInfo.businessLicenceValidity ? companyInfo.businessLicenceValidity : '长期'}</td>
										</tr>
										</tbody>
									</table>
									<div className="bg-grey prl2 mt3" style={{width: '533px'}}>
										<table style={{width: '100%', height: '120px'}}>
											<tbody>
											<tr>
												<td style={{width: '160px'}} className="text-darkgrey">法定代表人身份信息</td>
												<td><IconFont type="iconfont-yiwanshan" className="text-primary" style={{fontSize: '60px'}} /></td>
												<td style={{width: '160px'}} className="text-darkgrey">营业执照副本扫描件</td>
												<td><IconFont type="iconfont-yishangchuan" className="text-primary" style={{fontSize: '60px'}} /></td>
											</tr>
											{
												companyInfo.businessLicenceType !== '1' ?
													<tr>
														<td className="text-darkgrey">税务登记证副本扫描件</td>
														<td><IconFont type="iconfont-yishangchuan" className="text-primary" style={{fontSize: '60px'}} /></td>
														<td className="text-darkgrey">组织机构代码证副本<br />扫描件</td>
														<td><IconFont type="iconfont-yishangchuan" className="text-primary" style={{fontSize: '60px'}} /></td>
													</tr>
													:
													null
											}
											<tr>
												<td className="text-darkgrey">银行开户许可证扫描件</td>
												<td><IconFont type="iconfont-yishangchuan" className="text-primary" style={{fontSize: '60px'}} /></td>
											</tr>
											</tbody>
										</table>
									</div>
									<div className="mt4" />
									<IconFont type="iconfont-yirenzheng" className="icon-auth-pass" />
								</Col>
							</Row>
						</aside>
						:
						null
				}
				{/*等待审核*/}
				{
					companyInfo.status === 1 ?
						<aside style={{paddingBottom: '80px'}}>
							<Row className="auth-tips waite">
								<Col span={14}>
									<IconFont type="iconfont-shenhe" style={{color: '#29BCC8'}} className="large" />
									<b className="large prl1">认证审核中</b>
									<span className="text-muted h5">审核过程将需要1-2个工作日，请注意查收短信通知</span>
								</Col>
								<Col span={5} className="text-right">
									<Button type="primary"
									        style={{width: '100px', height: '40px'}}
									        onClick={this.props.refresh}
									>刷新</Button>
								</Col>
							</Row>
							<div className="auth-result-wrapper">
								<div className="personalHead mt5">
									—— <span className="prl1">{companyInfo.merchantName}</span> ——
								</div>
								<Row className="prl3">
									<Col span={5}>
										{
											companyInfo.companyType === 'com' ?
												<div className="auth-result-type company">企业用户</div>
												:
												<div className="auth-result-type person">个体工商户</div>
										}
									</Col>
									<Col span={18}>
										<table style={{height: '80px', width: '100%'}} className="mt5">
											<tbody>
											<tr>
												<td style={{width: '140px'}} className="text-muted">法定代表人姓名</td>
												<td className="text-darkgrey">{companyInfo.legalPersonName}</td>
											</tr>
											<tr>
												<td style={{width: '140px'}} className="text-muted">法定代表人身份证号</td>
												<td className="text-darkgrey">{
													companyInfo.legalPersonIdnum ? companyInfo.legalPersonIdnum.substring(0, 2).padEnd(18, '*')
														:
														''
												}</td>
											</tr>
											</tbody>
										</table>
										<div className="mt4" />
									</Col>
								</Row>
							</div>
						</aside>
						:
						null
				}
				{/*认证失败*/}
				{
					companyInfo.status === 3 ?
						<aside style={{paddingBottom: '80px'}}>
							<Row className="auth-tips error">
								<Col span={13}>
									<Icon type="close-circle" style={{color: '#EE845B'}} className="large" />
									<b className="large prl1">认证失败</b>
								</Col>
								<Col span={6} className="text-center">
									<Button type="primary"
									        onClick={() => {
										        Router.push('/auth/second')
									        }}>重新认证</Button>
									<Button type="primary" onClick={this.checkFaildReason}>查询失败原因</Button>
								</Col>
							</Row>
							<div className="auth-result-wrapper">
								<div className="personalHead mt5">
									—— <span className="prl1">{companyInfo.merchantName}</span> ——
								</div>
								<Row className="prl3">
									<Col span={5}>
										{
											companyInfo.companyType === 'com' ?
												<div className="auth-result-type company">企业用户</div>
												:
												<div className="auth-result-type person">个体工商户</div>
										}
									</Col>
									<Col span={18}>
										<table style={{height: '80px', width: '100%'}} className="mt5">
											<tbody>
											<tr>
												<td style={{width: '140px'}} className="text-muted">法定代表人姓名</td>
												<td className="text-darkgrey">{companyInfo.legalPersonName}</td>
											</tr>
											<tr>
												<td style={{width: '140px'}} className="text-muted">法定代表人身份证号</td>
												<td className="text-darkgrey">{
													companyInfo.legalPersonIdnum ? companyInfo.legalPersonIdnum.substring(0, 2).padEnd(18, '*')
														:
														''
												}</td>
											</tr>
											</tbody>
										</table>
										<div className="mt4" />
									</Col>
								</Row>
							</div>
						</aside>
						:
						null
				}
			</section>
		)
	}
}

export default ShowResult;
