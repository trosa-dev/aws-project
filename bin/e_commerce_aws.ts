// Importing 'source-map-support/register' to enable source map support for better debugging.
import 'source-map-support/register';

// Importing the AWS Cloud Development Kit library.
import * as cdk from 'aws-cdk-lib';

// Importing custom CDK stacks from their respective locations.
import { ProductsAppStack } from '../lib/productsApp-stack';
import { ECommerceApiGatewayStack } from '../lib/eCommerceApiGateway-stack';

// Creating a new CDK app instance.
const app = new cdk.App();

// Defining the AWS account and region for deployment.
const env: cdk.Environment = {
	account: "288595053204",
	region: "sa-east-1",
};

// Defining tags for the CloudFormation stacks.
const tags = {
	cost: "ECommerce",
	team: "TRTech.dev"
};

// Creating an instance of the ProductsAppStack with specified tags and environment.
const productsAppStack = new ProductsAppStack({
	id: "ProductsApp",
	scope: app,
	props: {
		tags,
		env,
	},
}
);

// Creating an instance of the EcommerceApiStack with specified tags, environment, and a dependency on productsAppStack.
const eCommerceApiStack = new ECommerceApiGatewayStack({
	id: "ECommerceApiGateway",
	scope: app,
	productsFetchHandler: productsAppStack.productsFetchHandler,
	props: {
		tags,
		env,
	},
}
);

// Adding a dependency between EcommerceApiStack and productsAppStack to ensure the correct deployment order.
eCommerceApiStack.addDependency(productsAppStack);
