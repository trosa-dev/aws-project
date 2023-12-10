import * as cdk from 'aws-cdk-lib';
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as cwlogs from "aws-cdk-lib/aws-logs"
import { Construct } from 'constructs';

// Define the properties expected by the ECommerceApiStack.
interface ECommerceApiGatewayStackProps extends cdk.StackProps {
	productsFetchHandler: lambdaNodeJS.NodejsFunction;
	scope: Construct;
	id: string;
	props: cdk.StackProps;
}

// Define the CloudFormation stack for the ECommerce API.
export class ECommerceApiGatewayStack extends cdk.Stack {
	// Constructor for the ECommerceApiStack.
	constructor(constructorProps: ECommerceApiGatewayStackProps) {
		const { scope, id, props, productsFetchHandler } = constructorProps;

		// Call the base class constructor with appropriate parameters.
		super(scope, id, props);

		// Create a CloudWatch Logs group for API Gateway logs.
		const logGroup = new cwlogs.LogGroup(this, "ECommerceApiGatewayLogs");

		// Create an instance of API Gateway.
		const api = new apigateway.RestApi(
			this,
			"ECommerceApiGateway",
			{
				restApiName: "ECommerceApiGateway",
				cloudWatchRole: true,
				deployOptions: {
					// Configure access logs for the API Gateway.
					accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
					accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
						httpMethod: true,
						ip: true,
						protocol: true,
						requestTime: true,
						resourcePath: true,
						responseLength: true,
						status: true,
						caller: true,
						user: true,
					}),
				}
			}
		);

		// Create a Lambda integration for the specified Lambda function.
		const productsFetchIntegration = new apigateway.LambdaIntegration(productsFetchHandler);

		// Create a resource ("/products") and associate the Lambda integration with a "GET" method.
		const productsResource = api.root.addResource("products");
		productsResource.addMethod("GET", productsFetchIntegration);
	}
}
