import React, {Fragment} from 'react';
import ClientRedirect from './ClientRedirect'
import NextHead from './components/NextHead';
import Footer from './components/Footer/';
import Header from './components/Header/';
import CommonHeader from './components/CommonHeader/';
import {ConfigProvider, Layout} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import './style.less'
import 'static/customer.less'

const {Content} = Layout;
export default ({title, children}) => (
	<ConfigProvider locale={zh_CN}>
		<NextHead title={title} />
		<CommonHeader />
		<Header type="index" />
		<Layout className="mt2" style={{maxWidth: '1220px', minHeight: '745px', margin: '0 auto'}}>
			<Content className="bg-white">
				<ClientRedirect from="" to="/login/index">
					{children}
				</ClientRedirect>
			</Content>
		</Layout>
		<Footer className="mt2" />
	</ConfigProvider>
);
