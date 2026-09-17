import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test("return all spells", async ({ request }) => {
  //1.poslem request na endpoint /spells
  const response = await request.get("http://localhost:3000/spells");
  //2.overim status odpovede -> SAMOSTATNE
  //status ma presny kod
  expect(response.status()).toBe(200);
  //status ma kod medzi 200-299
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  //3.overim data (ze je tam aspon 1 kuzlo)
  expect(body.length).toBeGreaterThan(0);
  //4.overim ze kazde kuzlo ma vyplneny nazov
  body.forEach((item) => {
    expect(item.spell).toBeTruthy();
    expect(item.id).toBeTruthy();
  });
});

//TODO: get spells by type, limit, isUnforgivable
test("returns spells by desired type", async ({ request }) => {
  //do konstanty si ulozim vybraty typ
  const expectedType = "Hex";
  //zavolam request s query parametrom
  const response = await request.get("http://localhost:3000/spells", {
    params: {
      type: expectedType,
    },
  });
  //overim ze odpoved je ok
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  //overim ze odpoved ma aspon jedneho clena
  expect(body.length).toBeGreaterThan(0);
  // pre kazdeho clena overim ze ma spravny typ
  body.forEach((item) => {
    expect(item.type).toEqual(expectedType);
  });
});

test("returns spells of desired limit", async ({ request }) => {
  const expectedLimit = 3;
  const response = await request.get("http://localhost:3000/spells", {
    params: {
      limit: expectedLimit,
    },
  });
  const body = await response.json();
  expect(body.length).toBe(expectedLimit);
});

test("returns unforgivable spells only", async ({ request }) => {
  const response = await request.get("http://localhost:3000/spells", {
    params: {
      isUnforgivable: true,
    },
  });
  const body = await response.json();

  expect(body.length).toBeGreaterThanOrEqual(3);

  body.forEach((item) => {
    expect(item.isUnforgivable).toEqual(true);
  });
});

//vytvorime novy test -> create new spell
//zavolame POST request na novy spell
//overime ze spell bol vytvoreny (vrati sa nam ID)

test("create new spell", async ({ request }) => {
  const newSpell = {
    spell: faker.book.title(),
    effect: "sneezing forever",
    type: "Curse",
    isUnforgivable: "false",
  };
  //Java Script Object Notation

  const response = await request.post("http://localhost:3000/spells", {
    data: newSpell,
  });

  const body = await response.json();
  // overte ze odpoved ma status 200-299
  expect(response.ok()).toBeTruthy();
  expect(response.ok()).toBe(true);
  await expect(response).toBeOK();
  expect(body.message).toEqual("Spell created");

  //overte ze v odpovedi sa nachazdza id vytvoreneho kuzla
  expect(body.spell.id).toBeTruthy();
  const spellId = body.spell.id;

  const spellDetailResponse = await request.get(
    "http://localhost:3000/spells/" + spellId,
  );

  expect(spellDetailResponse.ok()).toBeTruthy();
  const spellDetailBody = await spellDetailResponse.json();

  expect(spellDetailBody.id).toEqual(spellId);
  expect(spellDetailBody.spell).toEqual(newSpell.spell);
  expect(spellDetailBody.effect).toEqual(newSpell.effect);
  expect(spellDetailBody.type).toEqual(newSpell.type);
});
