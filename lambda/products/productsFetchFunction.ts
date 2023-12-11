import { HttpMethod } from "aws-cdk-lib/aws-events";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

// Define the AWS Lambda function handler.
export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
	// Extract the HTTP method from the API Gateway event.
	const method = event.httpMethod;

	// Extract requestId from both API Gateway and Lambda contexts.
	const apiRequestId = event.requestContext.requestId;
	const lambdaRequestId = context.awsRequestId;

	// Log the requestId information for tracking and debugging.
	console.log(`API Gateway RequestId: ${apiRequestId} - LambdaRequestId: ${lambdaRequestId}`);

	// Handle requests based on the resource path.
	switch (event.resource) {
		case "/products":
			switch (method) {
				case HttpMethod.GET:
					return {
						statusCode: 200,
						body: JSON.stringify({
							message: "GET Products - OK",
						}),
					};
				default:
					break;
			}
			break;

		case "/products/{id}":
			const productId = event.pathParameters!.id as string;

			switch (method) {
				case HttpMethod.GET:
					console.log(`GET /products/${productId}`);
					return {
						statusCode: 200,
						body: JSON.stringify({
							message: `GET /products/${productId} OK`,
						}),
					};
				default:
					break;
			}
			break;

		default:
	}

	// If no matching resource path is found, return a 400 Bad Request response.
	return {
		statusCode: 400,
		body: JSON.stringify({
			message: "Bad Requests",
		}),
	};
}
