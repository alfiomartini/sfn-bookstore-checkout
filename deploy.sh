#!/bin/bash

AWS_REGION=us-east-1
S3_BUCKET=sfn-bookstore-checkout-bucket

# Check if the S3 bucket exists
if ! aws s3api head-bucket --bucket "$S3_BUCKET" 2>/dev/null; then
  echo "S3 bucket $S3_BUCKET does not exist. Creating it..."
  if [ "$AWS_REGION" == "us-east-1" ]; then
    aws s3api create-bucket --bucket "$S3_BUCKET" --region "$AWS_REGION"
  else
    aws s3api create-bucket --bucket "$S3_BUCKET" --region "$AWS_REGION" --create-bucket-configuration LocationConstraint="$AWS_REGION"
  fi
else
  echo "S3 bucket $S3_BUCKET already exists."
fi

# Deploy the SAM stack
sam deploy \
  --template-file .aws-sam/build/template.yaml \
  --stack-name sfn-bookstore-checkout \
  --s3-bucket "$S3_BUCKET" \
  --capabilities CAPABILITY_IAM \
  --region "$AWS_REGION" \
  --profile default