import React, {Component, Fragment} from 'react';
import {sqPicUploadFun, sendSmsCode, sqAuthFun} from 'server';
import {checkIDNum, validateCredit, validatePhone} from 'config/regular';
import {baseUrl} from 'config/evn'
import {Button, Form, Radio, Input, Upload, Icon, Row, Col, Checkbox, message, DatePicker, Modal} from 'antd';
import cookie from 'react-cookies';
import Router from 'next/router';
import './style.less'

const FormItem = Form.Item;

class CompanyAuth extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userCode: cookie.load('ZjsWeb') ? cookie.load('ZjsWeb').userCode ? cookie.load('ZjsWeb').userCode : null : null,
			businessLicenseToggleRequire: true,//营业执照有效期和长期二选一
			legalPersonIdnumToggleRequire: true,//法人身份证有效期和长期二选一
			isShowSend: false,//是否显示发送验证码按钮
			isThreeInOne: true,//营业执照是否三合一
			codeTip: '发送验证码',
			count: 60,
			merchNo: this.props.userInfo.merchNo,
			mobile: this.props.userInfo.mobile,
			imageList: {},
			imageLoading: {},//图片加载中显示加载图标
			loading: false
		};
	}

	componentDidMount() {
		setTimeout(() => {
			//如果不是未认证的用户进到页面，提示后，强制去结果页
			if (this.props.userInfo.status !== 0 && this.props.userInfo.status !== 3) {
				Modal.info({
					title: '状态异常，请返回首页！',
					onOk() {
						Router.push({pathname: '/'})
					},
				});
			}
		}, 2000)
	}

	componentDidUpdate(prevProps) {
		if (prevProps.userInfo !== this.props.userInfo) {
			this.setState({
				merchNo: this.props.userInfo.merchNo,
				mobile: this.props.userInfo.mobile
			})
		}
	}

	//发送短信验证码
	sendSmsCodeInfo = () => {
		const form = this.props.form;
		let mobile = form.getFieldValue('legalPersonPhone');
		let params = {
			mobile
		};
		if (!mobile) return false;
		sendSmsCode(params).then(res => {
			if (res.result === 'success') {
				this.setTime();
				this.setState({
					isShowSend: true,
				});
			}
		})
	};

	//验证码倒计时
	setTime() {
		let self = this;
		if (this.state.isShowSend) return;
		let count = this.state.count;
		const timer = setInterval(function () {
			self.setState({
				count: --count,
			});
			if (count === 0) {
				clearInterval(timer);
				self.setState({
					isShowSend: false,
					count: 60,
					tipText: '重新发送'
				})
			}
		}, 1000);
	}

	//设置营业执照为长期有效
	setBusinessLicenseForEver = (e) => {
		this.setState({
			businessLicenseToggleRequire: !e.target.checked
		})
	};

	//设置身份证为长期有效
	setLegalPersonIdnumForEver = (e) => {
		this.setState({
			legalPersonIdnumToggleRequire: !e.target.checked
		})
	};

	//设置营业执照类型是三合一还是普通，显示要上传的图片
	setBusinessLicenceType = (e) => {
		this.setState({
			isThreeInOne: e.target.value
		})
	};

	//图片上传前验证格式和大小
	beforeUpload = (file) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('仅支持JPG/PNG!');
		}
		const isLt4M = file.size / 1024 / 1024 < 2;
		if (!isLt4M) {

			message.error('图片大小不能超过2MB!');
		}

		return isJpgOrPng && isLt4M;
	};

	imageChange = (files) => {
		if (files.file.status === 'error') {
			console.log(error)
		}
	};

	//图片转base64格式
	getBase64(img, callback) {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	//上传照片
	uploadImage = ({file}, type) => {
		const {imageList, imageLoading} = this.state;
		//开始上传就显示loading图标
		imageLoading[type] = true;
		imageList[type] = '';
		this.setState({
			imageLoading,
			imageList
		});
		this.props.form.setFieldsValue({
			[type]: '',
		});
		this.getBase64(file, imageFile => {
			let params = {
				file: imageFile,
				merchNo: this.state.merchNo
			};
			sqPicUploadFun(params).then(res => {
				if (res.result === 'success') {
					imageList[type] = res.data.filePath;
					imageLoading[type] = false;
					this.props.form.setFieldsValue({
						[type]: res.data.fileNum,
					});
					this.setState({
						imageList,
						imageLoading
					})
				}
			})
		});
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
				IDValidity: values.IDValidity ? values.IDValidity.format('YYYY-MM-DD') : '',
				businessLicenceValidity: values.businessLicenceValidity ? values.businessLicenceValidity.format('YYYY-MM-DD') : '',
				mobile: this.state.mobile
			};
			sqAuthFun(params).then(res => {
				if (res.result === 'success') {
					Modal.confirm({
						okButtonProps: {style: {display: 'none'}},
						title: '提示',
						content: <h4>提交成功，等待审核！</h4>,
						cancelText: '关闭',
						onCancel: () => {
							Router.replace({pathname: '/'})
						}
					})
				} else {
					this.setState({
						loading: false
					});
					message.error(res.msg);
				}
			})
		});
	};

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

	render() {
		const {getFieldDecorator, getFieldError, getFieldsError} = this.props.form;
		const {businessLicenseToggleRequire, legalPersonIdnumToggleRequire, isThreeInOne, imageList, imageLoading, loading} = this.state;
		const BtnGroup = this.state.isShowSend
			? <Button type="link" className="h4">{this.state.count}s</Button>
			: <Button type="link" className="h4"
			          disabled={getFieldError('legalPersonPhone') || !this.props.form.getFieldValue('legalPersonPhone')}
			          onClick={this.sendSmsCodeInfo}>{this.state.codeTip}</Button>;
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
				<Form {...formItemLayout}
				      onSubmit={this.handleSubmit}
				      style={{width: '1000px', margin: 'auto'}}
				      className="mt5">
					<FormItem label="企业营业地址">
						{getFieldDecorator('address', {
							rules: [
								{required: true, message: '请输入营业执照上的营业地址'},
							],
						})(
							<Input style={{width: '300px'}} type="text" placeholder="请输入营业执照上的营业地址" size="large" autoComplete="off" maxLength={50} />
						)}
					</FormItem>
					<FormItem label="营业执照类型">
						{getFieldDecorator('businessLicenceType', {
							initialValue: 1,
							rules: [
								{required: true, message: '请输入营业执照上的公司名称'},
							],
						})(
							<Radio.Group onChange={this.setBusinessLicenceType}>
								<Radio value={1}>三合一营业执照</Radio>
								<Radio value={0}>普通营业执照</Radio>
							</Radio.Group>
						)}
					</FormItem>
					<FormItem label="营业执照有效期">
						<FormItem style={{display: 'inline-block'}}>
							{getFieldDecorator('businessLicenceValidity', {
								rules: [
									{required: businessLicenseToggleRequire, message: '请输入营业执照有效期'},
								],
							})(
								<DatePicker style={{width: '300px'}} format="YYYY-MM-DD" size="large" placeholder="请输入营业执照有效期"
								            disabled={!businessLicenseToggleRequire} />
							)}
						</FormItem>
						<FormItem style={{display: 'inline-block'}}>
							{getFieldDecorator('longTimeOrNo', {
								rules: [
									{required: !businessLicenseToggleRequire, message: '营业执照是否长期'},
								],
							})(
								<div className="prl1"><Checkbox onChange={this.setBusinessLicenseForEver}>长期</Checkbox></div>
							)}
						</FormItem>
					</FormItem>
					<FormItem label={<div style={{display: 'inline-block', verticalAlign: 'middle'}}><h5>营业执照注册或</h5><h5>统一社会信用代码</h5></div>}>
						{getFieldDecorator('businessLicenceNo', {
							rules: [
								{required: true, message: '请输入18位信用代码'},
								{validator: validateCredit}
							],
						})(
							<Input style={{width: '300px'}} type="text" placeholder="请输入18位信用代码" size="large" maxLength={18} autoComplete="off" />
						)}
					</FormItem>
					<FormItem label="请上传">
						<Row>
							<Col span={6}>
								<FormItem style={{marginBottom: '0'}}>
									{getFieldDecorator('businessLicenceCopy', {
										rules: [
											{required: true, message: '营业执照副本'},
										],
									})(
										<Upload
											showUploadList={false}
											action=""
											beforeUpload={this.beforeUpload}
											onChange={this.imageChange}
											customRequest={(file) => this.uploadImage(file, 'businessLicenceCopy')}
										>
											{
												imageList.businessLicenceCopy ?
													<img className="gph-upload-btn" src={imageList.businessLicenceCopy ? baseUrl + imageList.businessLicenceCopy : ''}
													     alt="" />
													:
													<div className="gph-upload-btn">
														{imageLoading['businessLicenceCopy']}
														<Icon type={imageLoading['businessLicenceCopy'] ? 'loading' : 'plus'} className="large" />
														<h6 className="text-primary">{imageLoading['businessLicenceCopy'] ? '正在上传' : '点击上传'}</h6>
													</div>
											}
										</Upload>
									)}
									<div className="text-center text-darkgrey h6">营业执照副本</div>
								</FormItem>
							</Col>
							{
								isThreeInOne ?
									null
									:
									<Fragment>
										<Col span={6}>
											<FormItem style={{marginBottom: '0'}}>
												{getFieldDecorator('taxRegistrationCopy', {
													rules: [
														{required: true, message: '税务登记证副本'},
													],
												})(
													<Upload
														showUploadList={false}
														action=""
														beforeUpload={this.beforeUpload}
														customRequest={(file) => this.uploadImage(file, 'taxRegistrationCopy')}
													>
														{
															imageList.taxRegistrationCopy ?
																<img className="gph-upload-btn" src={imageList.taxRegistrationCopy ? baseUrl + imageList.taxRegistrationCopy : ''}
																     alt="" />
																:
																<div className="gph-upload-btn">
																	<Icon type={imageLoading['taxRegistrationCopy'] ? 'loading' : 'plus'} className="large text-" />
																	<h6 className="text-primary">{imageLoading['taxRegistrationCopy'] ? '正在上传' : '点击上传'}</h6>
																</div>
														}
													</Upload>
												)}
												<div className="text-center text-darkgrey h6">税务登记证副本</div>
											</FormItem></Col>
										<Col span={6}>
											<FormItem style={{marginBottom: '0'}}>
												{getFieldDecorator('organizationCodeCopy', {
													rules: [
														{required: true, message: '组织机构代码证副本'},
													],
												})(
													<Upload
														name="file"
														showUploadList={false}
														action=""
														beforeUpload={this.beforeUpload}
														customRequest={(file) => this.uploadImage(file, 'organizationCodeCopy')}
													>
														{
															imageList.organizationCodeCopy ?
																<img className="gph-upload-btn" src={imageList.organizationCodeCopy ? baseUrl + imageList.organizationCodeCopy : ''}
																     alt="" />
																:
																<div className="gph-upload-btn">
																	<Icon type={imageLoading['organizationCodeCopy'] ? 'loading' : 'plus'} className="large text-" />
																	<h6 className="text-primary">{imageLoading['organizationCodeCopy'] ? '正在上传' : '点击上传'}</h6>
																</div>
														}
													</Upload>
												)}
												<div className="text-center text-darkgrey h6">组织机构代码证副本</div>
											</FormItem></Col>
									</Fragment>
							}
							<Col span={6}>
								<FormItem style={{marginBottom: '0'}}>
									{getFieldDecorator('licenceForOpeningAccounts', {
										rules: [
											{required: true, message: '银行开户许可证'},
										],
									})(
										<Upload
											showUploadList={false}
											action=""
											beforeUpload={this.beforeUpload}
											customRequest={(file) => this.uploadImage(file, 'licenceForOpeningAccounts')}
										>
											{
												imageList.licenceForOpeningAccounts ?
													<img className="gph-upload-btn"
													     src={imageList.licenceForOpeningAccounts ? baseUrl + imageList.licenceForOpeningAccounts : ''}
													     alt="" />
													:
													<div className="gph-upload-btn">
														<Icon type={imageLoading['licenceForOpeningAccounts'] ? 'loading' : 'plus'} className="large text-" />
														<h6 className="text-primary">{imageLoading['licenceForOpeningAccounts'] ? '正在上传' : '点击上传'}</h6>
													</div>
											}
										</Upload>
									)}
									<div className="text-center text-darkgrey">银行开户许可</div>
								</FormItem>
							</Col>
						</Row>
						<h6 className="text-muted">图片大小限2M以内，格式仅限jpg、png、bmp</h6>
					</FormItem>
					<FormItem label="法人身份证有效期">
						<FormItem style={{display: 'inline-block'}}>
							{getFieldDecorator('IDValidity', {
								rules: [
									{required: legalPersonIdnumToggleRequire, message: '身份证有效期'}
								]
							})(
								<DatePicker style={{width: '300px'}} format="YYYY-MM-DD" placeholder="请选择身份证有效期" size="large"
								            disabled={!legalPersonIdnumToggleRequire} />
							)}
						</FormItem>
						<FormItem style={{display: 'inline-block'}}>
							{getFieldDecorator('longTimeOrNoPer', {
								rules: [
									{required: !legalPersonIdnumToggleRequire, message: '身份证是否长期'}
								]
							})(
								<div className="prl1"><Checkbox onChange={this.setLegalPersonIdnumForEver}>长期</Checkbox></div>
							)}
						</FormItem>
					</FormItem>
					<FormItem label="法定代表人姓名">
						{getFieldDecorator('legalPersonName', {
							rules: [
								{required: true, message: '法人姓名不能为空'},
								{validator: this.userName}
							],
						})(
							<Input style={{width: '300px'}} type="text" placeholder="请输入法人的真实姓名" size="large" maxLength={10} />
						)}
					</FormItem>
					<FormItem label="法定代表人身份证号码">
						{getFieldDecorator('legalPersonIdnum', {
							rules: [
								{required: true, message: '法定代表人身份证号码'},
								{validator: checkIDNum}
							]
						})(
							<Input style={{width: '300px'}} type="text" placeholder="请输入法人的18位身份证号码" size="large" maxLength={18} />
						)}
					</FormItem>
					<FormItem label="请上传">
						<Row>
							<Col span={6}>
								<FormItem style={{marginBottom: '0'}}>
									{getFieldDecorator('legalPersonIdphotoa', {
										rules: [
											{required: true, message: '法人身份证头像面拍照'}
										]
									})(
										<Upload
											showUploadList={false}
											action=""
											beforeUpload={this.beforeUpload}
											customRequest={(file) => this.uploadImage(file, 'legalPersonIdphotoa')}
										>
											{
												imageList.legalPersonIdphotoa ?
													<img className="gph-upload-btn" src={imageList.legalPersonIdphotoa ? baseUrl + imageList.legalPersonIdphotoa : ''}
													     alt="" />
													:
													<div className="gph-upload-btn">
														<Icon type={imageLoading['legalPersonIdphotoa'] ? 'loading' : 'plus'} className="large text-" />
														<h6 className="text-primary">{imageLoading['legalPersonIdphotoa'] ? '正在上传' : '点击上传'}</h6>
													</div>
											}
										</Upload>
									)}
									<div className="text-center text-darkgrey h6">法人身份证头像面拍照</div>
								</FormItem>
							</Col>
							<Col span={6}>
								<FormItem style={{marginBottom: '0'}}>
									{getFieldDecorator('legalPersonIdphotob', {
										rules: [
											{required: true, message: '法人身份证国徽面拍照'}
										]
									})(
										<Upload
											showUploadList={false}
											action=""
											beforeUpload={this.beforeUpload}
											customRequest={(file) => this.uploadImage(file, 'legalPersonIdphotob')}
										>
											{
												imageList.legalPersonIdphotob ?
													<img className="gph-upload-btn" src={imageList.legalPersonIdphotob ? baseUrl + imageList.legalPersonIdphotob : ''}
													     alt="" />
													:
													<div className="gph-upload-btn">
														<Icon type={imageLoading['legalPersonIdphotob'] ? 'loading' : 'plus'} className="large text-" />
														<h6 className="text-primary">{imageLoading['legalPersonIdphotob'] ? '正在上传' : '点击上传'}</h6>
													</div>
											}
										</Upload>
									)}
									<div className="text-center text-darkgrey h6">法人身份证国徽面拍照</div>
								</FormItem>
							</Col>
							<Col span={6}>
								<FormItem style={{marginBottom: '0'}}>
									{getFieldDecorator('legalPersonIdphotoc', {
										rules: [
											{required: true, message: '法人手持身份证拍照'}
										]
									})(
										<Upload
											showUploadList={false}
											action=""
											beforeUpload={this.beforeUpload}
											customRequest={(file) => this.uploadImage(file, 'legalPersonIdphotoc')}
										>
											{
												imageList.legalPersonIdphotoc ?
													<img className="gph-upload-btn" src={imageList.legalPersonIdphotoc ? baseUrl + imageList.legalPersonIdphotoc : ''}
													     alt="" />
													:
													<div className="gph-upload-btn">
														<Icon type={imageLoading['legalPersonIdphotoc'] ? 'loading' : 'plus'} className="large text-" />
														<h6 className="text-primary">{imageLoading['legalPersonIdphotoc'] ? '正在上传' : '点击上传'}</h6>
													</div>
											}
										</Upload>
									)}
									<div className="text-center text-darkgrey h6">法人手持身份证拍照</div>
								</FormItem>
							</Col>
						</Row>
						<h6 className="text-muted">
							图片大小限2M以内，格式仅限jpg、png、bmp
							<br />
							<br />
							拍照时请保持光线充足，人物面部无遮拦，证件照片无缺角、信息清晰可辨
						</h6>
					</FormItem>
					<FormItem label="法人代表人手机号">
						{getFieldDecorator('legalPersonPhone', {
							rules: [
								{validator: validatePhone},
								{required: true, message: '请输入法人代表人手机号'}
							]
						})(
							<Input style={{width: '300px'}} type="text" placeholder="请输入法人代表人手机号" size="large" maxLength={18} />
						)}
					</FormItem>
					<FormItem label="短信验证码">
						{getFieldDecorator('smsCode', {
							rules: [
								{required: true, message: '请输入短信验证码'}
							]
						})(
							<Input style={{width: '300px'}} type="text" placeholder="请输入短信验证码" size="large" maxLength={4} suffix={BtnGroup} />
						)}
					</FormItem>
					<FormItem wrapperCol={{span: 12, offset: 9}}>
						<Button type="primary" size="large" htmlType='submit' className="h3 mt3" style={{width: '300px'}} disabled={loading}>提交</Button>
						<br />
						<Button type="link" size="large" style={{width: '300px'}} className="h5" onClick={this.cancelAuth}>取消认证</Button>
					</FormItem>
				</Form>
			</section>
		);
	}
}

const CompanyAuthForm = Form.create()(CompanyAuth);
export default CompanyAuthForm
