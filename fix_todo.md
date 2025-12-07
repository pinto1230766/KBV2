# Fix "process is not defined" Error in Settings Component

## Problem

The Settings component is trying to access `process.env.npm_package_version` which is a Node.js global that doesn't exist in the browser environment, causing the "process is not defined" error.

## Solution Steps

- [x] Analyze the error in Settings.tsx
- [ ] Fix the process.env reference by using a Vite-compatible approach
- [ ] Test the fix to ensure the Settings page loads without errors

## Implementation

Replace `process.env.npm_package_version` with a proper Vite environment variable or hardcode the version.
