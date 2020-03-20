import React, {Component} from 'react';
import Layout from 'components/Layout/'
import FirstStep from './components/FirstStep'
import SecondStep from './components/SecondStep'
import {Steps, Form, Modal,} from 'antd';
import {observer, inject} from 'mobx-react'

const {Step} = Steps;

@inject('store')
@observer
class CompanyAuth extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const formItemLayout = {
			labelCol: {
				span: 6,
				offset: 0,
			},
			wrapperCol: {
				span: 16,
				offset: 0,
			},
		};

		return (
			<Layout mainMenuIndex="setting" title="企业认证" menuIndex={'5'}>
				<section className="bg-white ptb4 prl6">
					<div className="h0">企业实名认证</div>
					<Steps current={1} className="mt3" style={{width: '367px', margin: '0 auto'}}>
						<Step title="第一步" />
						<Step title="第二步" />
					</Steps>
					<SecondStep formItemLayout={formItemLayout} userInfo={this.props.store.userInfo} />
				</section>
			</Layout>
		);
	}
}

const CompanyAuthForm = Form.create()(CompanyAuth);
export default CompanyAuthForm
