import React from 'react'
import axios from 'config/http'
import {apiText} from 'config/evn'

/**
 * 注册双乾
 */
export const registFun = data => {
	return axios({
		url: '/payCenter/sqpay/register',
		method: 'post',
		data
	})
};

/**
 * 双乾认证
 */
export const sqAuthFun = data => {
	return axios({
		url: '/payCenter/sqpay/auth',
		method: 'post',
		data
	})
};

/**
 * 查询商户认证状态和失败原因
 */
export const loginIn = data => {
	return axios({
		url: apiText + '/unifyAuth/login',
		method: 'post',
		data
	})
};

/**
 * 获取短信验证码
 */
export const sendSmsCode = data => {
	return axios({
		url: apiText + '/userAccount/sendSmsCode',
		method: 'post',
		data
	})
};

/**
 * 根据mobile获取用户信息
 */
export const getUserInfoFun = (data) => {
	return axios({
		url: apiText + '/unifyAuth/authInfo',
		method: 'post',
		data
	})
};

/**
 * 双乾图片上传接口
 *
 */
export const sqPicUploadFun = (data) => {
	return axios({
		url: '/payCenter/sqpay/uploadImg',
		method: 'post',
		data
	})
};
/**
 * 查询商户认证状态和失败原因
 */
export const queryAccountStatusFun = params => {
	return axios({
		url: '/payCenter/query/queryAccount',
		method: 'get',
		params
	})
};
