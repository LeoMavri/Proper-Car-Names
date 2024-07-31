import xhook from "xhook";

const newToOld: { [oldName: string]: string } = {
  "Yotsuhada EVX": "Mitsubishi Evo X",
  "Stålhög 860": "Volvo 850",
  "Alpha Milano 156": "Alfa Romeo 156",
  "Bavaria X5": "BMW X5",
  "Coche Basurero": "Seat Leon Cupra",
  "Bedford Nova": "Vauxhall Astra GSI",
  "Verpestung Sport": "Volkswagen Golf GTI",
  "Echo S3": "Audi S3",
  "Volt RS": "Ford Focus RS",
  "Edomondo S2": "Honda S2000",
  "Nano Cavalier": "Mini Cooper S",
  "Colina Tanprice": "Ford Sierra Cosworth",
  "Cosmos EX": "Lotus Exige",
  "Bedford Racer": "Vauxhall Corsa",
  "Sturmfahrt 111": "Porsche 911 GT3",
  "Tsubasa Impressor": "Subaru Impreza STI",
  "Wington GGU": "TVR Sagaris",
  "Weston Marlin 177": "Aston Martin One-77",
  "Echo R8": "Audi R8",
  "Stormatti Casteon": "Bugatti Veyron",
  "Lolo 458": "Ferrari 458",
  "Lambrini Torobravo": "Lamborghini Gallardo",
  "Veloria LFA": "Lexus LFA",
  "Mercia SLR": "Mercedes SLR",
  "Zaibatsu GT-R": "Nissan GT-R",
  "Edomondo Localé": "Honda Civic",
  "Edomondo NSX": "Honda NSX",
  "Echo Quadrato": "Audi TT Quattro",
  "Bavaria M5": "BMW M5",
  "Bavaria Z8": "BMW Z8",
  "Chevalier CZ06": "Chevrolet Corvette Z06",
  "Dart Rampager": "Dodge Charger",
  "Knight Firebrand": "Pontiac Firebird",
  "Volt GT": "Ford GT",
  "Invader H3": "Hummer H3",
  "Echo S4": "Audi S4",
  "Edomondo IR": "Honda Integra R",
  "Edomondo ACD": "Honda Accord",
  "Tabata RM2": "Toyota MR2",
  "Verpestung Insecta": "Volkswagen Beetle",
  "Chevalier CVR": "Chevrolet Cavalier",
  "Volt MNG": "Ford Mustang",
  Trident: "Reliant Robin",
  "Oceania SS": "Holden SS",
  "Limoen Saxon": "Citroen Saxo",
  "Nano Pioneer": "Classic Mini",
  "Vita Bravo": "Fiat Punto",
  "Zaibatsu Macro": "Nissan Micra",
  "Çagoutte 10-6": "Peugeot 106",
  "Papani Colé": "Renault Clio",
};

function waitForElement<T extends HTMLElement>(
  querySelector: string,
  timeout?: number
): Promise<T | null> {
  return new Promise((resolve, _reject) => {
    let timer: number;
    if (document.querySelectorAll(querySelector).length) {
      return resolve(document.querySelector<T>(querySelector));
    }
    const observer = new MutationObserver(() => {
      if (document.querySelectorAll(querySelector).length) {
        observer.disconnect();
        if (timer != null) {
          clearTimeout(timer);
        }
        return resolve(document.querySelector<T>(querySelector));
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    if (timeout) {
      timer = setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    }
  });
}

async function undoTooltips(): Promise<void> {
  await waitForElement(".car img", 15_000);

  const cars = document.querySelectorAll<HTMLImageElement>(".car img");

  if (!cars.length) {
    console.warn("Failed to find car images");
    return;
  }

  cars.forEach((car) => {
    const ogName = newToOld[car.title.trim()] || car.title;
    car.title = ogName;
  });
}

async function undoNames(): Promise<void> {
  await waitForElement(".model", 10_000);
  const cars = document.querySelectorAll(".model");

  cars.forEach((car) => {
    const textContainer = car.children[0];

    if (!textContainer) {
      console.warn(`No child element found in`, car);
      return;
    }

    const oldName = textContainer.textContent?.trim();
    if (oldName) {
      const newName = newToOld[oldName];
      if (newName) {
        textContainer.textContent = newName;
      } else {
      }
    }
  });
}

async function undoUpgrades(): Promise<void> {
  const el = await waitForElement(".msg.right-round b");

  if (!el) {
    console.warn("Failed to find upgrade element");
    return;
  }

  const oldName = el.textContent?.trim();
  if (oldName) {
    const newName = newToOld[oldName];
    if (newName) {
      el.textContent = newName;
    }
  }
}

xhook.after((req, _res) => {
  const url = req.url;

  if (!url.includes("racing")) return;

  if (url.includes("&tab=parts&section=addParts")) {
    undoUpgrades();
    return;
  }

  if (url.includes("sid=racing&tab=race")) {
    undoNames();
    undoTooltips();
    return;
  }

  undoNames();
});

// first load
undoNames();
undoTooltips();
