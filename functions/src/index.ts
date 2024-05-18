/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { config as importConfig } from "firebase-functions";
import { HfInference } from "@huggingface/inference";
import { RateLimiterMemory } from 'rate-limiter-flexible';

const LLM_ENDPOINT = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-128k-instruct";
const RATE_LIMIT_TEXT = "Rate limit exceeded. You have hit the rate limit of 3 requests per minute. Please try again later.";

const rateLimiter = new RateLimiterMemory({
  points: 3, // Number of points
  duration: 60, // Per 60 seconds
});

const checkRateLimit = async (ip: string) => {
  try {
    await rateLimiter.consume(ip); // Consume 1 point per request
    return null;
  } catch (rejRes) {
    // If rate limit is exceeded
    return RATE_LIMIT_TEXT;
  }
};

const getInference = () => {
  const config = importConfig();
  const HF_TOKEN = config.huggingface.api_key;
  const inference = new HfInference(HF_TOKEN);
  return inference;
}

const getClientIp = (request: any) => {
  let ip = request.rawRequest.ip;
  if (!ip) {
    const xForwardedFor = request.rawRequest.headers['x-forwarded-for'];
    ip = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor || request.rawRequest.connection.remoteAddress;
  }
  return ip || "unknown";
}

const handleRateLimit = async (request: any) => {
  const ip = getClientIp(request);
  const rateLimitMessage = await checkRateLimit(ip);
  if (rateLimitMessage) {
    logger.info("Rate limit hit by IP:", ip);
    return rateLimitMessage;
  }
  return null;
}

// image to text
export const image_to_text = onCall(
  {
    enforceAppCheck: true,
    consumeAppCheckToken: true,
  },
  async (request) => {
    const rateLimitMessage = await handleRateLimit(request);
    if (rateLimitMessage) return rateLimitMessage;

    const base64String = request.data.file;
    const buffer = Buffer.from(base64String.split('base64,')[1], 'base64');

    const inference = getInference();
    const imageToTextResult = await inference.imageToText({
      data: buffer,
      model: "Salesforce/blip-image-captioning-large",
    },
      {
        use_cache: true,
        wait_for_model: true,
      });

    logger.info("image_to_text:\n", request.data);

    return imageToTextResult;
  }
);

// text generation
export const text_generation = onCall(
  {
    enforceAppCheck: true,
    consumeAppCheckToken: true,
  },
  async (request) => {
    const rateLimitMessage = await handleRateLimit(request);
    if (rateLimitMessage) return rateLimitMessage;

    const inference = getInference();
    const response = await inference.textGeneration({
      model: LLM_ENDPOINT,
      inputs: request.data.inputs,
      parameters: {
        max_new_tokens: request.data.max_new_tokens,
        temperature: request.data.temperature,
        top_p: request.data.top_p,
        repetition_penalty: request.data.repetition_penalty,
        return_full_text: request.data.return_full_text,
      },
    },
      {
        use_cache: false,
        wait_for_model: true,
      }
    );

    logger.info("text_generation:\n", request.data);

    return response;
  }
);


// import {onRequest} from "firebase-functions/v2/https";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
