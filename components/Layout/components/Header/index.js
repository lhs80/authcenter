import React, {Component} from 'react';
import {Row, Col} from 'antd'

class Header extends Component {
	render() {
		return (
			<div className="bg-white">
				<Row className="h1 ptb3" style={{maxWidth: '1200px', margin: '0 auto'}} align="middle" type="flex">
					<Col span={12}>
						<img src="/static/images/logo.png" alt="" />
						{
							this.props.type === 'index'
								?
								<span className="text-darkgrey large" style={{marginLeft: '26px'}}>认证中心</span>
								:
								null
						}
					</Col>
					<Col span={12} className="text-right">
						{
							this.props.type === 'login'
								?
								<span className="text-darkgrey">联系热线：<i className="text-primary">400-8820-830</i></span>
								:
								null
						}
					</Col>
				</Row>
			</div>
		);
	}
}

export default Header;
