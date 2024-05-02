const webdriver = require('selenium-webdriver');
const { By, logging } = webdriver;

describe('User Signup', () => {
  let driver;

  beforeAll(async () => {
    driver = new webdriver.Builder()
      .forBrowser('MicrosoftEdge')
      .setLoggingPrefs({ browser: 'ALL' }) // enable log collection
      .build();
    await driver.get('http://localhost:3000/signup'); // replace with your signup page url
    await driver.sleep(2000);
  }, 10000);

  afterAll(async () => {
    await driver.quit();
  }, 15000);

  test('signs up a new user', async () => {
    await driver.findElement(By.name('firstname')).sendKeys('Testing');
    await driver.findElement(By.name('lastname')).sendKeys('Test');
    await driver.findElement(By.name('email')).sendKeys('edber12345@example.com');
    await driver.findElement(By.name('password')).sendKeys('password123');
    await driver.findElement(By.name('confirmPassword')).sendKeys('password123');

    await driver.findElement(By.css('button[type="submit"]')).click();

    // get the browser logs
    const logs = await driver.manage().logs().get(logging.Type.BROWSER);
  });
});


