# Background

This is a mono repo for a serverless temporary email service.

The purpose of the app is to be able to create a temporary email address that can receive emails.

## Access to the app

The app is hosted on AWS.
The frontend can be accessed on: https://www.dev.inboxdev.castrojonsson.se/

The API can be accessed on: https://dev.inboxdev.castrojonsson.se/

~~Swagger/Open API documentation is avalible on: https://www.dev.inboxdev.castrojonsson.se/docs~~

## Deploying to AWS

Here is how you can deploy the frontend, API and infrastructure from your machine to AWS.

### Prerequisites

1. Make sure you have terraform installed
2. Make sure you have set up AWS CLI with administrator access to your aws project
3. In AWS you need to have set up a public Route53 hosted zone

### How to set up a public Route53 hosted zone:

Comming soon

### Terraform Variables:

See variables.tf

### Deploy

1. CD into TF folder
2. `terraform init`
3. `terraform workspace select -or-create YOUR_WORKSPACE_NAME`
4. `terraform plan -var-file=YOUR_TFVARS_FILE -out tfplan`
5. `terraform apply tfplan`
6. CD into frontend folder
7. Build frontend: `VITE_API_URL=api.YOUR_DOMAIN npn run build`
8. Deploy frontend: `aws s3 sync dist/ s3://YOUR_S3_BUCKET_NAME`

## Running localy

For now only the frontend can be run localy

### Frontend

CD into the ./vite-frontend directory and run:

1. `npm ci`
2. ~~`VITE_API_URL=api.YOUR_DOMAIN npm run dev`~~
3. `npm run dev`
4. Access the app on http://localhost:5173/

## Notes about the tech

The frontend is a static vite app hosted in a S3 bucket with cloud front infront of it

The backend is sevral microservices written in Python running on AWS lambda.
AWS REST API GW sits infront of the lambda and directs trafic to the diffrent function/endpoints

The infrastructure is managed by Terraform

## Infra:

Comming soon diagram of database

![SVG Image](https://www.dev.inboxdev.castrojonsson.se/infra.drawio.svg)

## Improvments

Things that can be improved about the app:

### API

- Investigate useing websockets insted of short polling for getting new emails

- Investigate useing AWS Cognito for authentication

- Add tests

### Frontend

- Features to add:

  - Delete individual emails

  - Mobile view

  - Handel attachments

- Add tests

### Infra

- Refactor the terraform code
