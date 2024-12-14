#!/bin/bash

# Define the table name
TABLE_NAME="sfn-bookstore-checkout-UserTable"

# Define the users to add
USERS=(
  '{"userId": {"S": "1"}, "name": {"S": "Alice"}, "points": {"N": "1200"}}'
  '{"userId": {"S": "2"}, "name": {"S": "Bob"}, "points": {"N": "1500"}}'
  '{"userId": {"S": "3"}, "name": {"S": "Charlie"}, "points": {"N": "900"}}'
  '{"userId": {"S": "4"}, "name": {"S": "Diana"}, "points": {"N": "1100"}}'
  '{"userId": {"S": "5"}, "name": {"S": "Eve"}, "points": {"N": "1300"}}'
)

# Add each user to the table
for USER in "${USERS[@]}"; do
  aws dynamodb put-item --table-name "$TABLE_NAME" --item "$USER"
done

echo "Users added to $TABLE_NAME"