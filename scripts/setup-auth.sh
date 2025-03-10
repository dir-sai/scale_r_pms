#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up authentication configuration...${NC}\n"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
  echo -e "${GREEN}Created .env file from .env.example${NC}"
fi

# Google OAuth Setup Instructions
echo -e "\n${BLUE}Google OAuth Setup Instructions:${NC}"
echo "1. Go to https://console.cloud.google.com/"
echo "2. Create a new project or select an existing one"
echo "3. Enable the Google OAuth2 API"
echo "4. Go to Credentials > Create Credentials > OAuth Client ID"
echo "5. Configure the OAuth consent screen"
echo "6. Create an OAuth 2.0 Client ID for a Web application"
echo "7. Add these authorized redirect URIs:"
echo "   - https://auth.expo.io/@your-username/scale-r-pms"
echo "   - exp://localhost:19000"
echo "8. Copy the Client ID and update EXPO_PUBLIC_GOOGLE_CLIENT_ID in .env"

# Facebook OAuth Setup Instructions
echo -e "\n${BLUE}Facebook OAuth Setup Instructions:${NC}"
echo "1. Go to https://developers.facebook.com/"
echo "2. Create a new app or select an existing one"
echo "3. Add Facebook Login product to your app"
echo "4. Go to Settings > Basic"
echo "5. Copy the App ID and update EXPO_PUBLIC_FACEBOOK_APP_ID in .env"
echo "6. Add these OAuth redirect URIs:"
echo "   - https://auth.expo.io/@your-username/scale-r-pms"
echo "   - exp://localhost:19000"

# EAS Setup Instructions
echo -e "\n${BLUE}EAS Setup Instructions:${NC}"
echo "1. Install EAS CLI: npm install -g eas-cli"
echo "2. Login to EAS: eas login"
echo "3. Create a new project: eas init"
echo "4. Copy the Project ID and update EAS_PROJECT_ID in .env"

echo -e "\n${GREEN}Setup instructions complete!${NC}"
echo "Please follow the instructions above to set up your authentication providers"
echo "Then update the values in your .env file accordingly" 