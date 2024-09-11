const axios = require('axios');

module.exports.loadTest = async (event) => {
    const apiURL = process.env.API_URL;

    const requestCount = event.requestCount || 100;

    let promises = [];

    for (let i = 0; i < requestCount; i++) {
        promises.push(axios.get(apiURL));
    }

    try{
        await Promise.all(promises);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully sent ${requestCount} requests to ${apiURL}`,
            })
        };
    }

    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to send requests to ${apiURL}'
            })
        };
    }

};

module.exports.sendLoadTestRequests = async (event) => {
    // SQS event contains a list of records (messages)
    for (const record of event.Records) {
        const body = JSON.parse(record.body);  // Parse the message body from SQS
        const requestCount = body.requestCount || 100;  // Number of requests to send
        const apiUrl = body.apiUrl;  // API URL from the message body

        // Define the fixed body for each POST request
        const fixedBody = {
            text: "To visit Las Vegas with my wife"
        };

        let promises = [];
        for (let i = 0; i < requestCount; i++) {
            promises.push(
                axios.post(apiUrl, fixedBody)  // Send POST request with the fixed body
            );
        }

        try {
            await Promise.all(promises);  // Wait for all requests to complete
            console.log(`Successfully sent ${requestCount} POST requests to ${apiUrl}`);
        } catch (error) {
            console.error('Error sending requests:', error.message);
        }
    }

    // Return success status after processing all records
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'All POST requests processed successfully' }),
    };
};