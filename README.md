# Tesseract OCR API

This project provides a Node.js API for Optical Character Recognition (OCR) using Tesseract.js version 5. It offers two main endpoints for text extraction and bounding box detection from images.

## Table of Contents

- [Installation](#installation)
- [Running Locally](#running-locally)
- [Docker Usage](#docker-usage)
- [API Endpoints](#api-endpoints)
- [Testing with Postman](#testing-with-postman)

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/atul262002/tesseract-ocr.git
   ```

2. Navigate to the project directory:
   ```
   cd tesseract-ocr
   ```

3. Install the required packages:
   ```
   npm install
   ```

## Running Locally

To run the project locally:

1. Start the development server:
   ```
   npm run dev
   ```

2. Start the main server:
   ```
   npm run start
   ```

The server will be running on `http://localhost:8000`.

## Docker Usage

You can also run this project using Docker:

1. Pull the Docker image:
   ```
   docker pull atul262002/tesseract-ocr-api
   ```

2. Run the Docker container:
   ```
   docker run -p 8000:8000 atul262002/tesseract-ocr-api
   ```

The API will be accessible at `http://localhost:8000`.

## API Endpoints

The API provides two main endpoints:

### 1. Extract Text

- **Endpoint**: `http://localhost:8000/api/get-text`
- **Method**: POST
- **Description**: Extracts the entire text from the uploaded image.

### 2. Get Bounding Boxes

- **Endpoint**: `http://localhost:8000/api/get-bbox`
- **Method**: POST
- **Description**: Extracts bounding boxes from the image for a particular type ("word", "line", "paragraph", "block", or "page").

## Testing with Postman

You can test the API using Postman. Here's how to use each endpoint:

### Extract Text

1. Set the request type to POST.
2. Set the URL to `http://localhost:8000/api/get-text`.
3. Choose one of the following methods to send the image:

   a. ***Using form-data***:
   - Key: `base64_image`
   - Value: Select the image file

   b. ***Using raw JSON***:
   ```json
   {
     "base64_image": "base64_encoded_image_string"
   }
   ```

### Get Bounding Boxes

1. Set the request type to POST.
2. Set the URL to `http://localhost:8000/api/get-bbox`.
3. Choose one of the following methods to send the image and bbox type:

   a. ***Using form-data***:
   - Key: `base64_image`
   - Value: Select the image file
   - Key: `bbox_type`
   - Value: Enter the type (e.g., "page", "word", "line", "paragraph", or "block")

   b. ***Using raw JSON***:
   ```json
   {
     "base64_image": "base64_encoded_image_string",
     "bbox_type": "page"
   }
   ```

Remember to set the appropriate headers (e.g., `Content-Type: application/json` for raw JSON requests).
