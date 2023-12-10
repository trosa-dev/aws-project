import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"

// Define the AWS Lambda function handler.
export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

	// Extract the HTTP method from the API Gateway event.
	const method = event.httpMethod;

	// Extract requestId from both API Gateway and Lambda contexts.
	const apiRequestId = event.requestContext.requestId;
	const lambdaRequestId = context.awsRequestId;

	// Log the requestId information for tracking and debugging.
	console.log(`API Gateway RequestId: ${apiRequestId} - LambdaRequestId: ${lambdaRequestId}`);

	// Check if the resource path is "/products".
	if (event.resource === "/products") {
		// Handle GET requests to "/products".
		if (method === 'GET') {
			console.log('GET')

			// Respond with a successful GET message.
			return {
				statusCode: 200,
				body: JSON.stringify({
					message: "GET Products - OK",
				})
			}
		}
	}

	// Respond with a generic message for unrecognized or unsupported requests.
	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "Bad Requests",
		})
	}
}
