#!/bin/sh

echo "✅ Generating Swagger docs"
node ace docs:generate

echo "🚀 Starting AdonisJS app"
node bin/server.js