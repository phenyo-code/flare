import { PrismaClient } from '@prisma/client';
import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

async function resetFeatures() {
  await prisma.product.updateMany({
    data: {
      features: [],
    },
  });
  console.log('Reset features field for all products.');
}

async function fetchImageBuffer(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from ${url}: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`Error fetching image: ${url}`, error);
    return null;
  }
}

async function extractAndSaveFeatures() {
  await resetFeatures();

  const products = await prisma.product.findMany({
    select: {
      id: true,
      images: true, // Assuming 'images' is an array of URLs
    },
  });

  const model = await mobilenet.load();

  for (const product of products) {
    const imageUrl = product.images[0]; // Use the first image URL
    if (!imageUrl) {
      console.warn(`No image URL found for product ${product.id}, skipping.`);
      continue;
    }

    try {
      const imgBuffer = await fetchImageBuffer(imageUrl);
      if (!imgBuffer) {
        console.warn(`Skipping product ${product.id} due to image fetch failure.`);
        continue;
      }

      const img = tf.node.decodeImage(imgBuffer);
      const features = model.infer(img, { embedding: true });
      const featureVector = await features.array();

      await prisma.product.update({
        where: { id: product.id },
        data: { features: featureVector[0] },
      });

      img.dispose();
      features.dispose();
      console.log(`Processed features for product ${product.id}`);
    } catch (error) {
      console.error(`Error processing image for product ${product.id}:`, error);
    }
  }

  await prisma.$disconnect();
}

extractAndSaveFeatures().catch(console.error);
