# CodeVector Backend Task

A backend API to browse 200,000 products with fast cursor-based pagination.

## Live URL
https://codevector-task-6cb6.onrender.com/products

## Tech Stack
- Node.js + Express
- PostgreSQL (Neon)

## Why cursor-based pagination?
Normal page-based pagination breaks when new data is added while browsing.
Cursor pagination uses the last seen product ID to fetch the next page,
so users never see duplicates or miss products.

## API Endpoints

GET /                                          → redirects to /products
GET /products                                  → first page (newest first)
GET /products?cursor=1000                      → next page after id 1000
GET /products?category=Electronics             → filter by category
GET /products?cursor=1000&category=Electronics → both together

## Setup
npm install
add DATABASE_URL to .env
node seed.js    → generates 200,000 products in batches
node index.js   → starts server on port 3000

## Seed Script
Inserts 200,000 products in batches of 10,000 using bulk insert
for fast insertion instead of slow row by row approach.
