Make a website and API like https://10minutemail.com/ using AWS SES.

## How it would work:

1. I would register a domain and make the necessary configs for SES to be able to send and receive emails.
   1. Have multiple domains and cycle though them at X interval.
2. Set up a DB (DynamoDB) to keep track of all address we have and there expiration time.
   1. Adress Item: PK(email Adress), SK(status/type?) email, TTL(When the email should expire), date create, domain?, Secret key???
   2. Email Item: PK(emailAdress), SK(type(email)), From, Subject, date, TTL(Same as adress), link to s3?, opened(bool)
3. S3 Bucket to store the incoming emails (.eml)
4. Flow to handel incoming emails
   1. Check if address exists and is active
   2. Store meta data in DDB
   3. Store email file in S3
5. Build an API with lambdas:
   1. Create new address
   2. Get all emails for that address
   3. Get an email (.eml)
   4. Delete email
   5. Reply to emails
   6. Extend time
6. Be able to do all in postman
7. Create a basic frontend
   1. Generate email button
   2. Extend email time
   3. Store email and secret in session or local storage
   4. Countdown for email expiration
   5. List all emails an be able to open them
8. Flow to handel expiration:
   1. Trigger on TTL expiration or run an event every 10 minuts??
   2. Set email SK as expired
      1. Create a new item PK address SK expired
      2. Delete old Item
   3. Delete all email items from DDB
   4. Delete folder with .eml from S3
9. Create this as IaC CDK or TF.

## Services used:

#### SES:

Used to send and receive email in AWS

#### DynamoDB:

Store data about active and used email addresses.
Store metadata about emails.

#### S3:

Store the .eml files of the emails
Files for the frontend React app

#### Lamba:

All the backend logic

#### API GW:

Handel routing to Lambda function.
Authentication.

#### Cloud Front:

Serving the frontend

#### Route53:

Handel DNS, might not be needed but good or IaC
Could also use this to disable domains that are not active at the time

## Improvements:

- Store a hash of address in DDB instead of the real address
  - Better privacy?
  - Incoming addresses will be converted to the hash and the hash will be checked agains DDB
- Track conversations
  - In the emails there are headers that tell you info about the conversations
  - We need to send custom emails through SES to make this work
- Basic analytics
  - How many users
  - How many uniq users
  - Emails received
  - Emails sent
  - Location???
- Rotate the domains used
- Encryption
  - Client will generate a public and privet key
  - Public key will be used by backend to encrypt .eml file
  - Private key will be used by client to decrypt .eml file
