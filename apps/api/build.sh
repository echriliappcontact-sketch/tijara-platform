#!/usr/bin/env bash
npm install
npx prisma generate
npx prisma migrate deploy
node dist/main.js
