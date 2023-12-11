// Import necessary CDK and AWS resources.
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynadb from "aws-cdk-lib/aws-dynamodb";

// Define the properties expected by the ProductsAppStack.
interface ProductsAppStackProps {
	scope: Construct;
	id: string;
	props?: cdk.StackProps;
}

// Define the CloudFormation stack for the Products App.
export class ProductsAppStack extends cdk.Stack {
	// Declare properties to hold references to the Lambda functions and DynamoDB table.
	readonly productsFetchHandler: lambdaNodeJS.NodejsFunction;
	readonly productsAdminHandler: lambdaNodeJS.NodejsFunction;
	readonly productsDbd: dynadb.Table;

	// Constructor for the ProductsAppStack.
	constructor(constructorProps: ProductsAppStackProps) {
		const { id, scope, props } = constructorProps;

		// Call the base class constructor with appropriate parameters.
		super(scope, id, props);

		// Create a DynamoDB table for storing product data.
		this.productsDbd = new dynadb.Table(this, "ProductDdb", {
			tableName: "products",
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			partitionKey: {
				name: 'id',
				type: dynadb.AttributeType.STRING
			},
			billingMode: dynadb.BillingMode.PROVISIONED,
			readCapacity: 1,
			writeCapacity: 1,
		});

		// Create a Node.js Lambda function for fetching products.
		this.productsFetchHandler = new lambdaNodeJS.NodejsFunction(
			this,
			"ProductsFetchFunction",
			{
				// Configure the Lambda function properties.
				functionName: "ProductsFetchFunction",
				entry: "lambda/products/productsFetchFunction.ts",
				handler: "handler",
				memorySize: 128,
				timeout: cdk.Duration.seconds(5),
				bundling: {
					// Configure bundling options for the Lambda function.
					minify: true,
					sourceMap: false,
				},
				environment: {
					PRODUCTS_DDB: this.productsDbd.tableName,
				}
			},
		);
		this.productsDbd.grantReadData(this.productsFetchHandler);

		// Create a Node.js Lambda function for handling product administration.
		this.productsAdminHandler = new lambdaNodeJS.NodejsFunction(
			this,
			"ProductsAdminFunction",
			{
				// Configure the Lambda function properties.
				functionName: "ProductsAdminFunction",
				entry: "lambda/products/productsAdminFunction.ts",
				handler: "handler",
				memorySize: 128,
				timeout: cdk.Duration.seconds(5),
				bundling: {
					// Configure bundling options for the Lambda function.
					minify: true,
					sourceMap: false,
				},
				environment: {
					PRODUCTS_DDB: this.productsDbd.tableName,
				}
			},
		);
		this.productsDbd.grantWriteData(this.productsAdminHandler);
	}
}
