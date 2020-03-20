import React from 'react'
import Link from 'next/link'
import {Row, Col, Layout, Icon, Divider} from 'antd'
import {iconUrl} from 'config/evn'
import './style.less'

const {Footer} = Layout;

const IconFont = Icon.createFromIconfontCN({
	scriptUrl: iconUrl,   //阿里巴巴图标引用地址
});

export default class MainFooter extends React.Component {
	render() {
		return (
			<Footer className="main-foot">
				<div className="h5 mt2">
					<span>Copyright © 中卅网络科技（苏州）有限公司</span>
					<span className="prl2">|</span>
					<a className='h5' href="http://www.beian.miit.gov.cn" target="_blank">苏ICP备19067992号</a>
				</div>
				<div className="mt1">
					<a href='http://www.cyberpolice.cn/wfjb/' target="_blank">
						<img src="/static/images/bg-police.png" alt="" />网络警察
					</a>
					<a href='http://www.js12377.cn/' target="_blank">
						<img src="/static/images/bg-report.png" alt="" />江苏互联网举报中心
					</a>
				</div>
			</Footer>
		)
	}
}
