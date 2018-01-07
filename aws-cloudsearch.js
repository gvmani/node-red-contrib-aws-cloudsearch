module.exports = function(RED) {

    function AwsCloudSearchNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;



        // Retrieve the config node
        var cloudsearch = RED.nodes.getNode(config.cloudsearch);
        var awsConfig = RED.nodes.getNode(cloudsearch.awsConfig);
        this.endpoint = cloudsearch.endpoint;
        this.apiVersion = cloudsearch.apiVersion;
        this.CloudSearchDomain = undefined;
        this.awsConfig = {
            accessKeyId : awsConfig.accessKeyId,
            secretAccessKey : awsConfig.secretAccessKey,
            region : awsConfig.region
          };

        
        if (this.awsConfig) {

          const AWS = require('aws-sdk');
          AWS.config.update(this.awsConfig);
          AWS.config.apiVersions = {
            cloudsearchdomain: this.apiVersion,
            // cloudsearchdomain: '2013-01-01',
          };
          this.CloudSearchDomain = new AWS.CloudSearchDomain({endpoint: this.endpoint});
          if(!this.CloudSearchDomain){
            return;
          }

          node.on('input', function(msg) {
            var params = {
                    query: msg.queryString, /* required */
                    queryParser: msg.queryParser || 'structured',
                    size: msg.pageSize || 10,
                    start: msg.startPage || 0
                };
                this.CloudSearchDomain.search(params, function (err, data) {
                    var productList = [];
                    var searchInfo = { page: msg.startPage, count: 0, isLastPage: 1 };
                    if (err) {
                        node.error("Seearch failed " + err.toString(), err.stack);
                    } else {
                      node.error("Log "+JSON.stringify(data.hits));
                        searchInfo.count = data.hits.found || 0;
                        if(parseInt(searchInfo.count) >= (parseInt(msg.startPage)+1)*msg.pageSize) {
                            searchInfo.isLastPage = 0;
                            searchInfo.totalCount = searchInfo.count;
                        }
                        productList = data.hits.hit || [];
                        searchInfo.count = productList.length;
                    }
                    //nextCallback(err, productList, searchInfo);
                    msg.payload = [err,productList,searchInfo];
                    node.send(msg);
                });


          });

        } else {
            // No config node configured
        }




    }
    RED.nodes.registerType("aws-cloudsearch",AwsCloudSearchNode);


    function AWSConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.accessKeyId = n.accessKeyId;
        this.secretAccessKey = n.secretAccessKey;
        this.region = n.region;
    }
    RED.nodes.registerType("aws-config",AWSConfigNode);

    function AWSCloudSearchConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.endpoint = n.endpoint;
        this.apiVersion = n.apiVersion;
        this.awsConfig = n.aws;
    }
    RED.nodes.registerType("aws-cloudsearch-config",AWSCloudSearchConfigNode);
}
