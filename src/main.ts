import xhook from 'xhook';

import { newToOld } from './items.js';
import { waitForElement } from './utils.js';

async function undoTooltips(): Promise<void> {
  await waitForElement('.car img', 15_000);

  const cars = document.querySelectorAll<HTMLImageElement>('.car img');

  if (!cars.length) {
    console.warn('Failed to find car images');
    return;
  }

  cars.forEach((car) => {
    const ogName = newToOld[car.title.trim()] || car.title;
    car.title = ogName;
  });
}

async function undoNames(): Promise<void> {
  await waitForElement('.model', 10_000);
  const cars = document.querySelectorAll('.model');

  cars.forEach((car) => {
    const textContainer = car.children[0];

    if (!textContainer) {
      console.warn(`No child element found in`, car);
      return;
    }

    const ogName = newToOld[textContainer.textContent?.trim() || ''] || textContainer.textContent;

    textContainer.textContent = ogName;
  });
}

async function undoUpgrades(): Promise<void> {
  const el = await waitForElement('.msg.right-round b');

  if (!el) {
    console.warn('Failed to find upgrade element');
    return;
  }

  const ogName = newToOld[el.textContent?.trim() || ''] || el.textContent;
  el.textContent = ogName;
}

xhook.after((req, _res) => {
  const url = req.url;

  if (!url.includes('racing')) return;

  if (url.includes('&tab=parts&section=addParts')) {
    undoUpgrades();
    return;
  }

  if (url.includes('sid=racing&tab=race')) {
    undoNames();
    undoTooltips();
    return;
  }

  undoNames();
});

// first load
undoNames();
undoTooltips();
