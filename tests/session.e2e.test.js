import { chromium } from "playwright";
import { httpServer } from "../server.js";

let browser, page, server;

beforeAll(async () => {
  // Démarre le serveur
  await new Promise((resolve) => {
    server = httpServer.listen(3000, resolve);
  });
  // Lance le navigateur
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000");
  const html = await page.content();
  console.log(html);
  await page.screenshot({ path: "debug-login.png" });
}, 20000); // timeout augmenté

afterAll(async () => {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
});

describe("Session utilisateur", () => {
  test("Connexion et envoi d’un message", async () => {
    console.log('Attente du formulaire...');
    await page.waitForSelector("form#login-form");
    console.log('Remplissage pseudo...');
    await page.fill('input[name="pseudo"]', "aaa");
    console.log('Remplissage password...');
    await page.fill('input[name="password"]', "aaa");
    console.log('Soumission...');
    await page.click('form#login-form button[type="submit"]');
    console.log('Reload après login...');
    await page.waitForTimeout(500); // laisse le temps au serveur de traiter
    await page.reload();
    console.log('Attente du chat...');
    await page.waitForSelector("#chat-container");
    console.log('Remplissage message...');
    await page.fill("#message", "Bonjour !");
    await page.click("#form button");
    await page.waitForSelector("#messages li");
    const messages = await page.$$eval("#messages li", (els) =>
      els.map((el) => el.textContent)
    );
    expect(messages.some((m) => m.includes("Bonjour"))).toBe(true);
  }, 20000); // timeout augmenté
});
