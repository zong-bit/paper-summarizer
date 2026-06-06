#!/bin/bash
INDEXNOW_KEY="brpwi6gOdYFSGI5Po4COamQWmiwFh57e"
URLS=(
  "https://www.summarizeai.app/"
  "https://www.summarizeai.app/premium"
  "https://www.summarizeai.app/blog"
)
URL_LIST=$(printf '"%s",' "${URLS[@]}")
URL_LIST="[${URL_LIST%,}]"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "https://www.bing.com/indexnow" \
  -H "Content-Type: application/json" \
  -d "{\"host\":\"www.summarizeai.app\",\"key\":\"$INDEXNOW_KEY\",\"keyLocation\":\"https://www.summarizeai.app/${INDEXNOW_KEY}.txt\",\"urlList\":$URL_LIST}" 2>&1)
echo "[$(date '+%Y-%m-%d %H:%M:%S')] IndexNow submitted for summarizeai.app (${#URLS[@]} URLs) → HTTP $RESPONSE"
