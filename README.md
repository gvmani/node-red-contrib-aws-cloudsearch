# AWS Cloudsearch node for Node-RED

Check it out! Now you can access your AWS Cloudsearch data with Node-RED!
This allows you to fetch AWS Cloudsearch data using node-red nodes.

Installing node-red-contrib-aws-cloudsearch
----------------------------
    cd ~/.node-red  #or wherever node-red is installed
    npm i node-red-contrib-aws-cloudsearch


Usage
-------
The params passed to searchdomain are picked from the msg payload. There are 2 options
to pass the params
1. Add a key 'params' to msg object and pass along all the parameters.
    ```
    msg.params = {
        query : "(and gender:'Men')",
        queryParser: "structured",
        size : 10
    }
      ```
2. Add individual parameters directly to msg object.
    ```
      msg.query = "(and gender:'Men')";
      msg.query = "structured";
      msg.size  = 10;
    ```

Refer [CloudSearchDomain SDK for supported params](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudSearchDomain.html)

TODO
-----
Only search is supported now.
Suggest and Upload documents needs to be added.

Have questions?  Found a bug?
-----------------------------
Please submit issues to the Github issue tracker
