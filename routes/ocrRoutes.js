// routes/ocrRoutes.js
const express = require("express");
const multer = require("multer");
const { createWorker } = require("tesseract.js");
const sharp = require("sharp");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

let worker;

// Initialize the worker
(async () => {
  worker = await createWorker();
})();

// Helper function to process image buffer using sharp
async function processImage(buffer) {
  const pngBuffer = await sharp(buffer).ensureAlpha().png().toBuffer();
  return pngBuffer;
}

// Helper function to get buffer from either form file upload or base64 string
async function getImageBuffer(req) {
  if (req.file) {
    return req.file.buffer; // From form file upload
  } else if (req.body.base64_image) {
    return Buffer.from(req.body.base64_image, "base64"); // From base64 string
  }
  throw new Error("Invalid base64_image.");
}

// Route 1: Extract text from an image (OCR)
router.post("/get-text", upload.single("image"), async (req, res) => {
  try {
    const buffer = await getImageBuffer(req);
    const processedBuffer = await processImage(buffer);
    const { data: { text } } = await worker.recognize(processedBuffer);

    res.json({ success: true, result: { text } });
  } catch (error) {
    console.error("Error in get-text API:", error.message);
    res.status(500).json({ success: false, error: { message: "Invalid base64_image." } });
  }
});

// Route 2: Extract bounding boxes
router.post("/get-bboxes", upload.single("image"), async (req, res) => {
  try {
    const buffer = await getImageBuffer(req);
    const bbox_type = req.body.bbox_type;
    const validBboxTypes = ["word", "line", "paragraph", "block", "page"];

    if (!validBboxTypes.includes(bbox_type)) {
      return res.status(400).json({ success: false, error: { message: "Invalid bbox_type." } });
    }

    const processedBuffer = await processImage(buffer);

    if (bbox_type === "page") {
      const imageMetadata = await sharp(processedBuffer).metadata();
      const pageBoundingBox = {
        x_min: 0,
        y_min: 0,
        x_max: imageMetadata.width,
        y_max: imageMetadata.height,
      };

      return res.json({ success: true, result: { bboxes: [pageBoundingBox] } });
    }

    const { data } = await worker.recognize(processedBuffer);
    let bboxes = [];

    switch (bbox_type) {
      case "word":
        bboxes = data.words.map(word => ({
          x_min: word.bbox.x0,
          y_min: word.bbox.y0,
          x_max: word.bbox.x1,
          y_max: word.bbox.y1,
        }));
        break;
      case "line":
        bboxes = data.lines.map(line => ({
          x_min: line.bbox.x0,
          y_min: line.bbox.y0,
          x_max: line.bbox.x1,
          y_max: line.bbox.y1,
        }));
        break;
      case "paragraph":
        bboxes = data.paragraphs.map(para => ({
          x_min: para.bbox.x0,
          y_min: para.bbox.y0,
          x_max: para.bbox.x1,
          y_max: para.bbox.y1,
        }));
        break;
      case "block":
        bboxes = data.blocks.map(block => ({
          x_min: block.bbox.x0,
          y_min: block.bbox.y0,
          x_max: block.bbox.x1,
          y_max: block.bbox.y1,
        }));
        break;
    }

    res.json({ success: true, result: { bboxes } });
  } catch (error) {
    console.error("Error in get-bboxes API:", error.message);
    res.status(500).json({ success: false, error: { message: "Invalid base64_image." } });
  }
});

module.exports = router;
