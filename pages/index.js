import React from 'react'
import Layout from 'components/Layout/'
import Result from './auth/components/ShowResult'
import {observer, inject} from 'mobx-react';
import cookie from 'react-cookies';
import {getUserInfoFun} from '../server';
import {message} from 'antd'

let msgBox = null;

@inject('store')
@observer
class CompanyAuthResult extends React.Component {
	constructor(props) {
		super(props);
	}

	refreshState = () => {
		let params = {
			mobile: this.props.store.userInfo.mobile,
			source: cookie.load('_source_')
		};
		if (!msgBox)
			getUserInfoFun(params).then(res => {
				if (res.result === 'success') {
					if (!msgBox)
						msgBox = message.info('刷新成功', 3, () => {
							msgBox = null;
						});
					this.props.store.setUserInfo(res.data);
				}
			})
	};

	render() {
		return (
			<Layout title="认证中心" className="">
				<Result companyInfo={this.props.store.userInfo} refresh={this.refreshState} />
			</Layout>
		)
	}
}

export default CompanyAuthResult;
