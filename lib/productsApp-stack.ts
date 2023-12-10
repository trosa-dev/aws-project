import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

// Define the properties expected by the ProductsAppStack.
interface ProductsAppStackProps {
	scope: Construct;
	id: string;
	props?: cdk.StackProps;
}

// Define the CloudFormation stack for the Products App.
export class ProductsAppStack extends cdk.Stack {
	// Declare a property to hold the reference to the products fetch Lambda function.
	readonly productsFetchHandler: lambdaNodeJS.NodejsFunction;

	// Constructor for the ProductsAppStack.
	constructor(constructorProps: ProductsAppStackProps) {
		const { id, scope, props } = constructorProps;

		// Call the base class constructor with appropriate parameters.
		super(scope, id, props);

		// Create a Node.js Lambda function for fetching products.
		this.productsFetchHandler = new lambdaNodeJS.NodejsFunction(
			this,
			"ProductsFetchFunction",
			{
				// Configure the Lambda function properties.
				functionName: "ProductsFetchFunction",
				entry: "lambda/products/productsFetchFunctions.ts",
				handler: "handler",
				memorySize: 128,
				timeout: cdk.Duration.seconds(5),
				bundling: {
					// Configure bundling options for the Lambda function.
					minify: true,
					sourceMap: false,
				}
			},
		);
	}
}
