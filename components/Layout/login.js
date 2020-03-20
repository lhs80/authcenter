import {Fragment} from 'react';
import NextHead from './components/NextHead';
import Footer from './components/Footer/';
import Header from './components/Header/';
import {ConfigProvider, Layout} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import './style.less'
import 'static/customer.less'
import React from 'react';

const {Content} = Layout;
export default ({title, searchType, searchKey, menuIndex, children, className}) => (
	<ConfigProvider locale={zh_CN}>
		<Fragment>
			<NextHead title={title} />
			<Header type="login"/>
			<Layout className={className}>
				<Content className='login-container'>
					{children}
				</Content>
				<Footer />
			</Layout>
		</Fragment>
	</ConfigProvider>
);
