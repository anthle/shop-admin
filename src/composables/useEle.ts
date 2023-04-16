type eleInfoType = 'success' | 'warning' | 'info' | 'error'

/**
 *
 * @param message 消息内容
 * @param type 消息类型
 * @param title 消息标题
 * @param dangerouslyUseHTMLString 是否将 message 属性作为 HTML 片段处理
 * @param duration 持续时间
 * @returns
 */
export function toast(
	message = '操作成功',
	type: eleInfoType = 'success',
	title = '',
	dangerouslyUseHTMLString = true,
	duration = 2000
) {
	return ElNotification({
		message,
		type,
		title,
		dangerouslyUseHTMLString,
		duration
	})
}

/**
 *
 * @param content 提示内容
 * @param type 提示类型
 * @param title 提示标题
 * @returns
 */
export function showModal(content = '提示内容', type: eleInfoType = 'warning', title = '') {
	return ElMessageBox.confirm(content, title, {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type
	})
}
