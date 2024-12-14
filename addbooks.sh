#!/bin/bash

# Define the table name
TABLE_NAME="sfn-bookstore-checkout-BookTable"

# Define the books to add
BOOKS=(
  '{"bookId": {"S": "1"}, "title": {"S": "The Great Gatsby"}, "author": {"S": "F. Scott Fitzgerald"}, "price": {"N": "10.99"}, "quantity": {"N": "100"}}'
  '{"bookId": {"S": "2"}, "title": {"S": "1984"}, "author": {"S": "George Orwell"}, "price": {"N": "8.99"}, "quantity": {"N": "200"}}'
  '{"bookId": {"S": "3"}, "title": {"S": "To Kill a Mockingbird"}, "author": {"S": "Harper Lee"}, "price": {"N": "12.99"}, "quantity": {"N": "150"}}'
  '{"bookId": {"S": "4"}, "title": {"S": "Pride and Prejudice"}, "author": {"S": "Jane Austen"}, "price": {"N": "9.99"}, "quantity": {"N": "120"}}'
  '{"bookId": {"S": "5"}, "title": {"S": "The Catcher in the Rye"}, "author": {"S": "J.D. Salinger"}, "price": {"N": "11.99"}, "quantity": {"N": "80"}}'
)

# Add each book to the table
for BOOK in "${BOOKS[@]}"; do
  aws dynamodb put-item --table-name "$TABLE_NAME" --item "$BOOK"
done

echo "Books added to $TABLE_NAME"