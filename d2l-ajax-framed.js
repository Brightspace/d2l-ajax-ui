'use strict';

var jwt = require('frau-jwt');

Polymer({
	is: 'd2l-ajax-framed',
	properties: {
		auto: {
			type: Boolean,
			value: false
		},
		url: {
			type: String
		},
		params: {
			type: Object,
			value: function() {
				return {};
			}
		},
		method: {
			type: String,
			value: 'GET'
		},
		headers: {
			type: Object,
			value: function() {
				return {};
			}
		},
		contentType: {
			type: String,
			value: null
		},
		body: {
			type: Object,
			value: null
		},
		handleAs: {
			type: String,
			value: 'json'
		},
		withCredentials: {
			type: Boolean,
			value: false
		},
		timeout: {
			type: Number,
			value: 0
		},
		lastResponse: {
			type: Object,
			notify: true
		},
		lastError: {
			type: Object,
			notify: true
		},
		scope: {
			type: String,
			value: '*:*:*'
		},
		authToken: {
			type: String,
			value: function() {
				return null;
			}
		}
	},
	observers: [
		'_requestOptionsChanged(url, method, params.*, headers, contentType, ' +
			'body, handleAs, withCredentials, timeout, auto)'
	],
	computeHeaders: function(headers, authToken) {
		var result = {},
			header;

		if (authToken) {
			result.Authorization = 'Bearer ' + authToken;
		}

		if (headers instanceof Object) {
			for (header in headers) {
				result[header] = headers[header].toString();
			}
		}

		return result;
	},
	generateRequest: function() {
		jwt(this.scope)
			.then(function(token) {
				this.authToken = token;
				this.$.request.generateRequest();
			}.bind(this))
			.catch(function(e) {
				this.onError(e);
			}.bind(this));
	},
	onError: function(e) {
		var data = e;
		if (e && e.detail) {
			data = e.detail;
		}
		this.fire('iron-ajax-error', data);
	},
	onRequest: function(e) {
		this.fire('iron-ajax-request', e.detail);
	},
	onResponse: function(e) {
		this.fire('iron-ajax-response', e.detail);
	},
	_requestOptionsChanged: function() {
		if (this.url == null) {
			return;
		}
		if (this.auto) {
			this.generateRequest();
		}
	}
});
