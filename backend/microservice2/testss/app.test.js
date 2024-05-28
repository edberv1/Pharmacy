const webdriver = require('selenium-webdriver');
const { By, logging } = webdriver;

//1
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
    await driver.findElement(By.name('email')).sendKeys('besimcmega2@example.com');
    await driver.findElement(By.name('password')).sendKeys('password123');
    await driver.findElement(By.name('confirmPassword')).sendKeys('password123');

    await driver.findElement(By.css('button[type="submit"]')).click();

    // get the browser logs
    const logs = await driver.manage().logs().get(logging.Type.BROWSER);
  });
});

//2
describe('User Login', () => {
    let driver;
  
    beforeAll(async () => {
        driver = new webdriver.Builder()
          .forBrowser('MicrosoftEdge')
          .setLoggingPrefs({ browser: 'ALL' }) // enable log collection
          .build();
        await driver.get('http://localhost:3000/login'); // replace with your signup page url
        await driver.sleep(2000);
      }, 10000);

    afterAll(async () => {
      await driver.quit();
    }, 15000);
  
    test('logs in an existing user', async () => {
      // replace the selectors with the actual ones from your login form
      await driver.findElement(By.name('email')).sendKeys('besimcmega2@example.com');
      await driver.findElement(By.name('password')).sendKeys('password123');
  
      await driver.findElement(By.css('button[type="submit"]')).click();
  
    });
  });

//3
  describe('Superadmin Create Users', () => {
    let driver;
  
    beforeAll(async () => {
      driver = new webdriver.Builder()
        .forBrowser('MicrosoftEdge')
        .setLoggingPrefs({ browser: 'ALL' }) // enable log collection
        .build();
      await driver.get('http://localhost:3000/login'); // replace with your login page url
      await driver.sleep(2000);
    }, 10000);
  
    afterAll(async () => {
      await driver.quit();
    }, 15000);
  
    test('create a user from superadmin', async () => {
      // replace the selectors with the actual ones from your login form
      await driver.findElement(By.name('email')).sendKeys('besimcmega1@example.com');
      await driver.findElement(By.name('password')).sendKeys('password123');
  
      await driver.findElement(By.css('button[type="submit"]')).click();
  
      await driver.sleep(2000);
  
      await driver.get('http://localhost:3000/superadmin/users');
  
      await driver.sleep(2000);
  
      await driver.findElement(By.id('create-user-button')).click();

      await driver.sleep(2000); // wait for 2 seconds
      
      // fill out the create user form
      await driver.findElement(By.name('firstname')).sendKeys('testing');
      await driver.findElement(By.name('lastname')).sendKeys('Test');
      await driver.findElement(By.name('email')).sendKeys('superadminTest@example.com');
      await driver.findElement(By.name('password')).sendKeys('password123');
      await driver.findElement(By.name('roleId')).sendKeys('2'); // replace with actual role id
      
      await driver.findElement(By.css('button[type="submit"]')).click();
    }, 30000);
  });


  //4
  describe('Superadmin Create Roles', () => {
    let driver;
  
    beforeAll(async () => {
      driver = new webdriver.Builder()
        .forBrowser('MicrosoftEdge')
        .setLoggingPrefs({ browser: 'ALL' }) // enable log collection
        .build();
      await driver.get('http://localhost:3000/login'); // replace with your login page url
      await driver.sleep(2000);
    }, 10000);
  
    afterAll(async () => {
      await driver.quit();
    }, 15000);
  
    test('create a role from superadmin', async () => {
      // replace the selectors with the actual ones from your login form
      await driver.findElement(By.name('email')).sendKeys('besimcmega1@example.com');
      await driver.findElement(By.name('password')).sendKeys('password123');
  
      await driver.findElement(By.css('button[type="submit"]')).click();
  
      await driver.sleep(2000);
  
      await driver.get('http://localhost:3000/superadmin/roles');
  
      await driver.sleep(2000);
  
      await driver.findElement(By.id('create-role-button')).click();

      await driver.sleep(2000); // wait for 2 seconds
      
      // fill out the create user form
      await driver.findElement(By.name('role')).sendKeys('testing');
      
      await driver.findElement(By.css('button[type="submit"]')).click();
    }, 30000);
  });
