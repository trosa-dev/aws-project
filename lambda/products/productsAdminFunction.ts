import { HttpMethod } from "aws-cdk-lib/aws-events";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

// Define the AWS Lambda function handler.
export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
	// Extract requestId from both API Gateway and Lambda contexts.
	const apiRequestId = event.requestContext.requestId;
	const lambdaRequestId = context.awsRequestId;

	// Log the requestId information for tracking and debugging.
	console.log(`API Gateway RequestId: ${apiRequestId} - LambdaRequestId: ${lambdaRequestId}`);

	// Extract the HTTP method from the API Gateway event.
	const method = event.httpMethod;

	// Handle requests based on the resource path.
	switch (event.resource) {
		case "/products":
			switch (method) {
				case HttpMethod.POST:
					console.log("POST /products");
					return {
						statusCode: 201,
						body: JSON.stringify({
							message: "POST Products - OK",
						}),
					};
				default:
					break;
			}
			break;

		case "/products/{id}":
			const productId = event.pathParameters!.id as string;

			switch (method) {
				case HttpMethod.PUT:
					console.log(`PUT /products/${productId}`);
					return {
						statusCode: 201,
						body: JSON.stringify({
							message: `PUT /products/${productId} OK`,
						}),
					};
				case HttpMethod.DELETE:
					console.log(`DELETE /products/${productId}`);
					return {
						statusCode: 201,
						body: JSON.stringify({
							message: `DELETE /products/${productId} OK`,
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
