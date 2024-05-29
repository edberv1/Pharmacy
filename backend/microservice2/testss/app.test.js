const webdriver = require('selenium-webdriver');
const { Builder, By, logging, until, Select } = webdriver;
const path = require('path');


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
      await driver.findElement(By.name('email')).sendKeys('besimcmega7@gmail.com');
      await driver.findElement(By.name('password')).sendKeys('123');
  
      await driver.findElement(By.css('button[type="submit"]')).click();
  
    });
  });

//3

describe('Superadmin Create Users', () => {
  let driver;

  beforeAll(async () => {
    driver = new webdriver.Builder()
      .forBrowser('MicrosoftEdge')
      .setLoggingPrefs({ browser: 'ALL' }) 
      .build();
    await driver.get('http://localhost:3000/login'); 
    await driver.sleep(2000);
  }, 10000);

  afterAll(async () => {
    await driver.quit();
  }, 15000);

  test('create a user from superadmin', async () => {
    // replace the selectors with the actual ones from your login form
    await driver.findElement(By.name('email')).sendKeys('besimcmega7@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('123');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.sleep(2000);

    await driver.get('http://localhost:3000/superadmin/users');
    await driver.sleep(2000);

    await driver.findElement(By.id('create-user-button')).click();
    await driver.sleep(2000); // wait for 2 seconds for modal to open

    // fill out the create user form
    await driver.findElement(By.name('firstname')).sendKeys('testingSuperAdmin');
    await driver.findElement(By.name('lastname')).sendKeys('Testtt');
    await driver.findElement(By.name('email')).sendKeys('superadminTest@example.com');
    await driver.findElement(By.name('password')).sendKeys('password123');

    const roleSelect = await driver.findElement(By.name('roleId'));
    await roleSelect.click();
    await driver.findElement(By.css('option[value="2"]')).click(); // replace with actual role id

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
      await driver.findElement(By.name('email')).sendKeys('besimcmega7@gmail.com');
      await driver.findElement(By.name('password')).sendKeys('123');
  
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

  //5
  describe('Superadmin Delete Roles', () => {
    let driver;
  
    beforeAll(async () => {
      driver = new webdriver.Builder()
        .forBrowser('MicrosoftEdge')
        .setLoggingPrefs({ browser: 'ALL' })
        .build();
      await driver.get('http://localhost:3000/login');
      await driver.sleep(2000);
    }, 10000);
  
    afterAll(async () => {
      await driver.quit();
    }, 15000);
  
    test('delete a role named testing from superadmin', async () => {
      // Login as superadmin
      await driver.findElement(By.name('email')).sendKeys('besimcmega7@gmail.com');
      await driver.findElement(By.name('password')).sendKeys('123');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.sleep(2000);
  
      // Navigate to roles page
      await driver.get('http://localhost:3000/superadmin/roles');
      await driver.sleep(2000);
  
      // Locate the role named "testing" and delete it
      const rows = await driver.findElements(By.css('tbody tr'));
      let roleFound = false;
  
      for (const row of rows) {
        const roleName = await row.findElement(By.css('td:nth-child(2)')).getText();
        if (roleName === 'testing') {
          roleFound = true;
          await row.findElement(By.css('button[id="delete-role-button"]')).click();
          await driver.sleep(1000);
  
          await driver.findElement(By.css('button.confirm-delete')).click();
          await driver.sleep(2000);
          break;
        }
      }
  
      if (!roleFound) {
        throw new Error('Role named "testing" not found');
      }
    }, 30000);
  });

  //6
  describe('Superadmin Delete Users', () => {
    let driver;
  
    beforeAll(async () => {
      driver = new webdriver.Builder()
        .forBrowser('MicrosoftEdge')
        .setLoggingPrefs({ browser: 'ALL' })
        .build();
      await driver.get('http://localhost:3000/login');
      await driver.sleep(2000);
    }, 10000);
  
    afterAll(async () => {
      await driver.quit();
    }, 15000);
  
    test('delete a user with email superadminTest@example.com from superadmin', async () => {
      // Login as superadmin
      await driver.findElement(By.name('email')).sendKeys('besimcmega7@gmail.com');
      await driver.findElement(By.name('password')).sendKeys('123');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.sleep(2000);
  
      // Navigate to roles page
      await driver.get('http://localhost:3000/superadmin/users');
      await driver.sleep(2000);
  
      // Locate the email named "superadminTest" and delete it
      const rows = await driver.findElements(By.css('tbody tr'));
      let emailFound = false;
  
      for (const row of rows) {
        const email = await row.findElement(By.css('td:nth-child(3)')).getText();
        if (email === 'superadminTest@example.com') {
          emailFound = true;
          await row.findElement(By.css('button[id="delete-user-button"]')).click();
          await driver.sleep(1000);
  
          await driver.findElement(By.css('button.confirm-delete')).click();
          await driver.sleep(2000);
          break;
        }
      }
  
      if (!emailFound) {
        throw new Error('Email named "superadminTest@example.com" not found');
      }
    }, 30000);
  });


  //7
  describe('License Insert User', () => {
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
  
    test('user applies for license', async () => {
      // Login as superadmin
      await driver.findElement(By.name('email')).sendKeys('testexample7@gmail.com');
      await driver.findElement(By.name('password')).sendKeys('123');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.sleep(2000);
      
      // Navigate to users page
      await driver.get('http://localhost:3000');
      await driver.sleep(3000);
  
      // Click the "Get started" button to navigate to the pharmacyForm page
      await driver.findElement(By.css('a#pharmacyForm')).click();
      await driver.sleep(2000);
  
      // Fill out the license form
      await driver.findElement(By.name('licenseId')).sendKeys('1231231312');
  
      // Select today's date for issueDate
      const issueDateElement = await driver.findElement(By.name('issueDate'));
      const today = new Date();
      const issueDateFormatted = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
      await issueDateElement.sendKeys(issueDateFormatted);
  
      // Calculate expiry date (today + 10 days)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 10);
      const expiryDateFormatted = `${expiryDate.getMonth() + 1}/${expiryDate.getDate()}/${expiryDate.getFullYear()}`;
  
      // Select calculated expiry date for expiryDate
      const expiryDateElement = await driver.findElement(By.name('expiryDate'));
      await expiryDateElement.sendKeys(expiryDateFormatted);
  
      // Use path module to get absolute path
      const filePath = path.resolve('C:/Users/Besim/Desktop/Besim/CV/Besim Çmega CV Resume.pdf');
      console.log("Absolute file path:", filePath);
      await driver.findElement(By.name('license')).sendKeys(filePath);
  
      // Submit the form
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.sleep(8000);
    }, 20000);
  });

  //8 
  describe('View License User', () => {
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
    
      test('view the user license', async () => {
        // Login as superadmin
        await driver.findElement(By.name('email')).sendKeys('besimcmega7@gmail.com');
        await driver.findElement(By.name('password')).sendKeys('123');
        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.sleep(2000);
        
        // Navigate to users page
        await driver.get('http://localhost:3000/superAdmin/requests');
        await driver.sleep(3000);
    
        // Click the "Get started" button to navigate to the pharmacyForm page
        await driver.findElement(By.name('view')).click();
        await driver.sleep(2000);
    
       
      }, 15000);
    });
  
  //9
  describe('Approve License User', () => {
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
  
    test('approves the user license', async () => {
      // Login as superadmin
      await driver.findElement(By.name('email')).sendKeys('besimcmega7@gmail.com');
      await driver.findElement(By.name('password')).sendKeys('123');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.sleep(2000);
      
      // Navigate to users page
      await driver.get('http://localhost:3000/superAdmin/requests');
      await driver.sleep(3000);
  
      // Click the "Get started" button to navigate to the pharmacyForm page
      await driver.findElement(By.name('approve')).click();
      await driver.sleep(2000);
  
     
    }, 15000);
  });

  //10

  describe('Admin Create Pharmacy', () => {
      let driver;
    
      beforeAll(async () => {
        driver = new webdriver.Builder()
          .forBrowser('MicrosoftEdge')
          .setLoggingPrefs({ browser: 'ALL' }) 
          .build();
        await driver.get('http://localhost:3000/login'); 
        await driver.sleep(2000);
      }, 10000);
    
      afterAll(async () => {
        await driver.quit();
      }, 15000);
    
      test('create a pharmacy from admin', async () => {
        // replace the selectors with the actual ones from your login form
        await driver.findElement(By.name('email')).sendKeys('testexample7@gmail.com');
        await driver.findElement(By.name('password')).sendKeys('123');
        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.sleep(2000);
    
        await driver.get('http://localhost:3000/admin/myPharmacies');
        await driver.sleep(2000);
    
        await driver.findElement(By.id('create-pharmacy-button')).click();
        await driver.sleep(2000); // wait for 2 seconds for modal to open
    
        // fill out the create user form
        await driver.findElement(By.name('name')).sendKeys('Testing10');

        // Find the "Location" dropdown component
        const locationDropdown = await driver.findElement(By.name('location'));

        // Select the desired location by its text value
        const desiredLocation = 'Prishtinë'; // Replace with the location you want to select
        await locationDropdown.sendKeys(desiredLocation);
    
        await driver.findElement(By.name('street')).sendKeys('TestingStreet10');

        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.sleep(5000);

        
    
    
      }, 30000);
    });

  //11
  describe('Superadmin Create Users', () => {
    let driver;
  
    beforeAll(async () => {
      driver = new webdriver.Builder()
        .forBrowser('MicrosoftEdge')
        .setLoggingPrefs({ browser: 'ALL' }) 
        .build();
      await driver.get('http://localhost:3000/login'); 
      await driver.sleep(2000);
    }, 10000);
  
    afterAll(async () => {
      await driver.quit();
    }, 15000);
  
    test('create a product from admin pharmacies', async () => {
      // Replace the selectors with the actual ones from your login form
      await driver.findElement(By.name('email')).sendKeys('testexample7@gmail.com');
      await driver.findElement(By.name('password')).sendKeys('123');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.sleep(2000);
    
      await driver.get('http://localhost:3000/admin/myPharmacies');
      await driver.sleep(2000);
    
      // Filter pharmacies by name "Testing10"
      const filteredPharmacies = await driver.executeScript(() => {
        return Array.from(document.querySelectorAll('.see')).filter(pharmacy => {
          return pharmacy.innerText.includes('Testing10');
        });
      });
    
      if (filteredPharmacies.length === 0) {
        throw new Error('No pharmacy found with the name "Testing10"');
      }
    
      await filteredPharmacies[0].click(); // Click on the pharmacy
      await driver.sleep(2000); // Wait for 2 seconds for modal to open
    
      await driver.findElement(By.id('create-product-id')).click();
      await driver.sleep(2000); // Wait for 2 seconds for modal to open
    
      // Fill out the product user form
      await driver.findElement(By.name('name')).sendKeys('TestingProduct11');
    
      // Use path module to get absolute path
      const filePathProduct = path.resolve('C:/Users/Besim/Desktop/Harun/broski.jpeg');
      console.log("Absolute file path:", filePathProduct);
      await driver.findElement(By.name('image')).sendKeys(filePathProduct);
    
      await driver.findElement(By.name('description')).sendKeys('TestingProductDescription11');
      await driver.findElement(By.name('produced')).sendKeys('TestingProductProduced11');
      await driver.findElement(By.name('price')).sendKeys('11');
      await driver.findElement(By.name('stock')).sendKeys('11');
    
      await driver.findElement(By.name('create')).click();
      await driver.sleep(5000);
    }, 30000);
    
  });

  //12
  describe('Admin Delete Product', () => {
    let driver;
  
    beforeAll(async () => {
      driver = new webdriver.Builder()
        .forBrowser('MicrosoftEdge')
        .setLoggingPrefs({ browser: 'ALL' }) 
        .build();
      await driver.get('http://localhost:3000/login'); 
      await driver.sleep(2000);
    }, 10000);
  
    afterAll(async () => {
      await driver.quit();
    }, 15000);
  
    test('delete a product from admin pharmacies', async () => {
      // Replace the selectors with the actual ones from your login form
      await driver.findElement(By.name('email')).sendKeys('testexample7@gmail.com');
      await driver.findElement(By.name('password')).sendKeys('123');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.sleep(2000);
    
      await driver.get('http://localhost:3000/admin/myPharmacies');
      await driver.sleep(2000);
    
      // Filter pharmacies by name "Testing10"
      const filteredPharmacies = await driver.executeScript(() => {
        return Array.from(document.querySelectorAll('.see')).filter(pharmacy => {
          return pharmacy.innerText.includes('Testing10');
        });
      });
    
      if (filteredPharmacies.length === 0) {
        throw new Error('No pharmacy found with the name "Testing10"');
      }
    
      await filteredPharmacies[0].click(); // Click on the pharmacy
      await driver.sleep(2000); 
    
      // Locate the role named "testing" and delete it
       const rows = await driver.findElements(By.css('tbody tr'));
       let productFound = false;
  
      for (const row of rows) {
        const productName = await row.findElement(By.css('td:nth-child(2)')).getText();
        if (productName === 'TestingProduct11') {
          productFound = true;
          await row.findElement(By.css('button[id="delete-product-id"]')).click();
          await driver.sleep(1000);
  
          await driver.findElement(By.css('button.confirm-delete')).click();
          await driver.sleep(2000);
          break;
        }
      }
  
      if (!productFound) {
        throw new Error('Product named "TestingProduct11" not found');
      }
    }, 30000);
    
  });



  


  
