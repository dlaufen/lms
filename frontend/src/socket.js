import { io } from 'socket.io-client'
import { socketio_port } from '../../../../sites/common_site_config.json'
import { getCachedListResource } from 'frappe-ui/src/resources/listResource'
import { getCachedResource } from 'frappe-ui/src/resources/resources'

export function initSocket() {
	let host = window.location.hostname
	let siteName = window.site_name || host
	let port = window.location.port ? `:${socketio_port}` : ''
	let protocol = port ? 'http' : 'https'
	let url = `${protocol}://${host}${port}/${siteName}`

	url = get_host();
	
	let socket = io(url, {
		withCredentials: true,
		reconnectionAttempts: 5,
	})
	socket.on('refetch_resource', (data) => {
		if (data.cache_key) {
			let resource =
				getCachedResource(data.cache_key) ||
				getCachedListResource(data.cache_key)
			if (resource) {
				resource.reload()
			}
		}
	})
	return socket
}

function get_host(port = 9000) {
	let host = window.location.origin;
	if (window.dev_server) {
		let parts = host.split(":");
		port = frappe.boot.socketio_port || port.toString() || "9000";
		if (parts.length > 2) {
			host = parts[0] + ":" + parts[1];
		}
		host = host + ":" + port;
	}
	return host + '/lms_test'   // frappe.boot not in context  `/${frappe.boot.sitename}`;
}
