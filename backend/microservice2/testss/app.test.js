const webdriver = require('selenium-webdriver');
const { Builder, By, logging, until } = webdriver;

//1
// describe('User Signup', () => {
//   let driver;

//   beforeAll(async () => {
//     driver = new webdriver.Builder()
//       .forBrowser('MicrosoftEdge')
//       .setLoggingPrefs({ browser: 'ALL' }) // enable log collection
//       .build();
//     await driver.get('http://localhost:3000/signup'); // replace with your signup page url
//     await driver.sleep(2000);
//   }, 10000);

//   afterAll(async () => {
//     await driver.quit();
//   }, 15000);

//   test('signs up a new user', async () => {
//     await driver.findElement(By.name('firstname')).sendKeys('Testing');
//     await driver.findElement(By.name('lastname')).sendKeys('Test');
//     await driver.findElement(By.name('email')).sendKeys('besimcmega2@example.com');
//     await driver.findElement(By.name('password')).sendKeys('password123');
//     await driver.findElement(By.name('confirmPassword')).sendKeys('password123');

//     await driver.findElement(By.css('button[type="submit"]')).click();

//     // get the browser logs
//     const logs = await driver.manage().logs().get(logging.Type.BROWSER);
//   });
// });

// //2
// describe('User Login', () => {
//     let driver;
  
//     beforeAll(async () => {
//         driver = new webdriver.Builder()
//           .forBrowser('MicrosoftEdge')
//           .setLoggingPrefs({ browser: 'ALL' }) // enable log collection
//           .build();
//         await driver.get('http://localhost:3000/login'); // replace with your signup page url
//         await driver.sleep(2000);
//       }, 10000);

//     afterAll(async () => {
//       await driver.quit();
//     }, 15000);
  
//     test('logs in an existing user', async () => {
//       // replace the selectors with the actual ones from your login form
//       await driver.findElement(By.name('email')).sendKeys('besimcmega7@gmail.com');
//       await driver.findElement(By.name('password')).sendKeys('123');
  
//       await driver.findElement(By.css('button[type="submit"]')).click();
  
//     });
//   });

// //3

// describe('Superadmin Create Users', () => {
//   let driver;

//   beforeAll(async () => {
//     driver = new webdriver.Builder()
//       .forBrowser('MicrosoftEdge')
//       .setLoggingPrefs({ browser: 'ALL' }) 
//       .build();
//     await driver.get('http://localhost:3000/login'); 
//     await driver.sleep(2000);
//   }, 10000);

//   afterAll(async () => {
//     await driver.quit();
//   }, 15000);

//   test('create a user from superadmin', async () => {
//     // replace the selectors with the actual ones from your login form
//     await driver.findElement(By.name('email')).sendKeys('besimcmega7@gmail.com');
//     await driver.findElement(By.name('password')).sendKeys('123');
//     await driver.findElement(By.css('button[type="submit"]')).click();
//     await driver.sleep(2000);

//     await driver.get('http://localhost:3000/superadmin/users');
//     await driver.sleep(2000);

//     await driver.findElement(By.id('create-user-button')).click();
//     await driver.sleep(2000); // wait for 2 seconds for modal to open

//     // fill out the create user form
//     await driver.findElement(By.name('firstname')).sendKeys('testingSuperAdmin');
//     await driver.findElement(By.name('lastname')).sendKeys('Testtt');
//     await driver.findElement(By.name('email')).sendKeys('superadminTest@example.com');
//     await driver.findElement(By.name('password')).sendKeys('password123');

//     const roleSelect = await driver.findElement(By.name('roleId'));
//     await roleSelect.click();
//     await driver.findElement(By.css('option[value="2"]')).click(); // replace with actual role id

//     await driver.findElement(By.css('button[type="submit"]')).click();

//   }, 30000);
// });




//   //4
//   describe('Superadmin Create Roles', () => {
//     let driver;
  
//     beforeAll(async () => {
//       driver = new webdriver.Builder()
//         .forBrowser('MicrosoftEdge')
//         .setLoggingPrefs({ browser: 'ALL' }) // enable log collection
//         .build();
//       await driver.get('http://localhost:3000/login'); // replace with your login page url
//       await driver.sleep(2000);
//     }, 10000);
  
//     afterAll(async () => {
//       await driver.quit();
//     }, 15000);
  
//     test('create a role from superadmin', async () => {
//       // replace the selectors with the actual ones from your login form
//       await driver.findElement(By.name('email')).sendKeys('besimcmega7@gmail.com');
//       await driver.findElement(By.name('password')).sendKeys('123');
  
//       await driver.findElement(By.css('button[type="submit"]')).click();
  
//       await driver.sleep(2000);
  
//       await driver.get('http://localhost:3000/superadmin/roles');
  
//       await driver.sleep(2000);
  
//       await driver.findElement(By.id('create-role-button')).click();

//       await driver.sleep(2000); // wait for 2 seconds
      
//       // fill out the create user form
//       await driver.findElement(By.name('role')).sendKeys('testing');
      
//       await driver.findElement(By.css('button[type="submit"]')).click();
//     }, 30000);
//   });

//   //5
//   describe('Superadmin Delete Roles', () => {
//     let driver;
  
//     beforeAll(async () => {
//       driver = new webdriver.Builder()
//         .forBrowser('MicrosoftEdge')
//         .setLoggingPrefs({ browser: 'ALL' })
//         .build();
//       await driver.get('http://localhost:3000/login');
//       await driver.sleep(2000);
//     }, 10000);
  
//     afterAll(async () => {
//       await driver.quit();
//     }, 15000);
  
//     test('delete a role named testing from superadmin', async () => {
//       // Login as superadmin
//       await driver.findElement(By.name('email')).sendKeys('besimcmega7@gmail.com');
//       await driver.findElement(By.name('password')).sendKeys('123');
//       await driver.findElement(By.css('button[type="submit"]')).click();
//       await driver.sleep(2000);
  
//       // Navigate to roles page
//       await driver.get('http://localhost:3000/superadmin/roles');
//       await driver.sleep(2000);
  
//       // Locate the role named "testing" and delete it
//       const rows = await driver.findElements(By.css('tbody tr'));
//       let roleFound = false;
  
//       for (const row of rows) {
//         const roleName = await row.findElement(By.css('td:nth-child(2)')).getText();
//         if (roleName === 'testing') {
//           roleFound = true;
//           await row.findElement(By.css('button[id="delete-role-button"]')).click();
//           await driver.sleep(1000);
  
//           await driver.findElement(By.css('button.confirm-delete')).click();
//           await driver.sleep(2000);
//           break;
//         }
//       }
  
//       if (!roleFound) {
//         throw new Error('Role named "testing" not found');
//       }
//     }, 30000);
//   });

//   //6
//   describe('Superadmin Delete Users', () => {
//     let driver;
  
//     beforeAll(async () => {
//       driver = new webdriver.Builder()
//         .forBrowser('MicrosoftEdge')
//         .setLoggingPrefs({ browser: 'ALL' })
//         .build();
//       await driver.get('http://localhost:3000/login');
//       await driver.sleep(2000);
//     }, 10000);
  
//     afterAll(async () => {
//       await driver.quit();
//     }, 15000);
  
//     test('delete a user with email superadminTest@example.com from superadmin', async () => {
//       // Login as superadmin
//       await driver.findElement(By.name('email')).sendKeys('besimcmega7@gmail.com');
//       await driver.findElement(By.name('password')).sendKeys('123');
//       await driver.findElement(By.css('button[type="submit"]')).click();
//       await driver.sleep(2000);
  
//       // Navigate to roles page
//       await driver.get('http://localhost:3000/superadmin/users');
//       await driver.sleep(2000);
  
//       // Locate the email named "superadminTest" and delete it
//       const rows = await driver.findElements(By.css('tbody tr'));
//       let emailFound = false;
  
//       for (const row of rows) {
//         const email = await row.findElement(By.css('td:nth-child(3)')).getText();
//         if (email === 'superadminTest@example.com') {
//           emailFound = true;
//           await row.findElement(By.css('button[id="delete-user-button"]')).click();
//           await driver.sleep(1000);
  
//           await driver.findElement(By.css('button.confirm-delete')).click();
//           await driver.sleep(2000);
//           break;
//         }
//       }
  
//       if (!emailFound) {
//         throw new Error('Email named "superadminTest@example.com" not found');
//       }
//     }, 30000);
//   });


  //7

describe('Superadmin Edit Users', () => {
  let driver;

  beforeAll(async () => {
    driver = new Builder()
      .forBrowser('MicrosoftEdge')
      .setLoggingPrefs({ browser: 'ALL' })
      .build();
    await driver.get('http://localhost:3000/login');
    await driver.sleep(2000);
  }, 10000);

  afterAll(async () => {
    await driver.quit();
  }, 15000);

  test('edit a user with email superadminTest@example.com from superadmin and verifying that user', async () => {
    // Login as superadmin
    await driver.findElement(By.name('email')).sendKeys('besimcmega7@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('123');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.sleep(2000);

    // Navigate to users page
    await driver.get('http://localhost:3000/superadmin/users');
    await driver.sleep(2000);

    // Locate the email named "superadminTest@example.com" and edit it
    const rows = await driver.findElements(By.css('tbody tr'));
    let emailFound = false;

    for (const row of rows) {
      const email = await row.findElement(By.css('td:nth-child(3)')).getText();
      if (email === 'besimcmega2@example.com') {
        emailFound = true;
        await row.findElement(By.css('button[id="edit-user-button"]')).click();
        await driver.sleep(2000);

            // Wait until the verified select is visible and clickable
        const verifiedSelect = await driver.wait(until.elementLocated(By.name('verified')), 5000);
        await driver.wait(until.elementIsVisible(verifiedSelect), 5000);
        await driver.wait(until.elementIsEnabled(verifiedSelect), 5000);

        // Ensure the select element is in the viewport
        await driver.executeScript("arguments[0].scrollIntoView(true);", verifiedSelect);

        // Use JavaScript to directly set the value of the select element
        await driver.executeScript("arguments[0].value = '1';", verifiedSelect);
  

        // Submit the form
        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.sleep(2000);
        break;
      }
    }

    if (!emailFound) {
      throw new Error('Email named "besimcmega2@example.com" not found');
    }
  }, 30000);
});


  
