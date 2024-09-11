for i in {1..100}
do
   aws sqs send-message --queue-url https://sqs.us-west-1.amazonaws.com/637423491345/LoadTestQueue \
     --message-body '{"requestCount": 150, "apiUrl": "http://my-alb-992819187.us-west-1.elb.amazonaws.com/goals"}'
done