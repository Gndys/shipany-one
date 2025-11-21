#!/bin/bash

echo "Testing YouTube API..."
echo ""

curl -X POST http://localhost:3000/api/youtube \
  -H "Content-Type: application/json" \
  -d '{"tags": ["AI"], "maxResults": 5}' \
  | jq '.'

echo ""
echo "Test completed!"
