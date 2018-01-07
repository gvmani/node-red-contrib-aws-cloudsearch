module.exports = function(RED) {

	function AwsCloudSearchNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;



		// Retrieve the config node
		var cloudsearch = RED.nodes.getNode(config.cloudsearch);
		var awsConfig = RED.nodes.getNode(cloudsearch.awsConfig);
		this.endpoint = cloudsearch.endpoint;
		this.apiVersion = cloudsearch.apiVersion;
		this.CloudSearchDomain = undefined;
		this.awsConfig = {
			accessKeyId: awsConfig.accessKeyId,
			secretAccessKey: awsConfig.secretAccessKey,
			region: awsConfig.region
		};


		if(this.awsConfig) {

			const AWS = require('aws-sdk');
			AWS.config.update(this.awsConfig);
			AWS.config.apiVersions = {
				cloudsearchdomain: this.apiVersion,
				// cloudsearchdomain: '2013-01-01',
			};
			this.CloudSearchDomain = new AWS.CloudSearchDomain({ endpoint: this.endpoint });
			if(!this.CloudSearchDomain) {
				return;
			}

			node.on('input', function(msg) {
				var params = msg.params || getParamObject(msg);




				this.CloudSearchDomain.search(params, function(err, data) {
					if(err) {
						node.error("Search failed " + err.toString(), err.stack);
					}
					msg.payload = [err, data];
					node.send(msg);
				});


			});

		} else {
			// No config node configured
			node.error("No node configured");
		}




	}

	function getParamObject(msg) {
		var supportedKeys = ['query', 'facet', 'queryParser', 'size', 'start', 'filterQuery', 'highlight', 'partial', 'queryOptions', 'return', 'sort', 'stats'];
		var params = {};

		supportedKeys.forEach(e => {
				if(msg[e] !== undefined) {
					params[e] = msg[e];
				}
			}

		);
		
    return params;
	}


	RED.nodes.registerType("aws-cloudsearch", AwsCloudSearchNode);


	function AWSConfigNode(n) {
		RED.nodes.createNode(this, n);
		this.accessKeyId = n.accessKeyId;
		this.secretAccessKey = n.secretAccessKey;
		this.region = n.region;
	}
	RED.nodes.registerType("aws-config", AWSConfigNode);

	function AWSCloudSearchConfigNode(n) {
		RED.nodes.createNode(this, n);
		this.endpoint = n.endpoint;
		this.apiVersion = n.apiVersion;
		this.awsConfig = n.aws;
	}
	RED.nodes.registerType("aws-cloudsearch-config", AWSCloudSearchConfigNode);
}
