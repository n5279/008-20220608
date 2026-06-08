<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b18f5168-2b6b-451e-b187-36b37fabceaa

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## One-Click Cloud Run Deploy

If you want to publish a browser-test version to Google Cloud Run, use:

1. Double-click [deploy-cloud-run.cmd](./deploy-cloud-run.cmd)
2. Or run `.\deploy-cloud-run.ps1`

The script will:

- check `gcloud` login
- set your GCP project
- enable required APIs
- install dependencies
- run `npm run lint`
- deploy the app to Cloud Run

You only need to provide:

- `Project ID`
- `Service name`
- `Region`
- `GEMINI_API_KEY` (optional, but needed for AI features)
