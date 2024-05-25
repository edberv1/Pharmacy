const runMigrations = (pool) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool:", err);
      return;
    }

    console.log("Connected to MySQL database");

    // Create Roles Table
    const createTableQueryRoles = `
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role VARCHAR(255) NOT NULL UNIQUE
      )
    `;

    connection.query(createTableQueryRoles, (err, result) => {
      if (err) {
        console.error("Error creating roles table:", err);
        connection.release();
        return;
      }
      console.log("Roles Table created successfully");

      // Create Users Table
      const createTableQueryUsers = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          firstname VARCHAR(255) NOT NULL,
          lastname VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          roleId INT,
          FOREIGN KEY (roleId) REFERENCES roles(id),
          refreshToken VARCHAR(255),
          verified BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          resetToken VARCHAR(255)
        )
      `;

      connection.query(createTableQueryUsers, (err, result) => {
        if (err) {
          console.error("Error creating users table:", err);
          connection.release();
          return;
        }
        console.log("Users Table created successfully");

        // Insert initial roles if necessary
        connection.query(
          "SELECT COUNT(*) AS roleCount FROM roles",
          (err, rows) => {
            if (err) {
              console.error("Error counting roles:", err);
              connection.release();
              return;
            }

            const roleCount = rows[0].roleCount;
            if (roleCount < 3) {
              const rolesToInsert = ["superadmin", "admin", "user"];
              const insertRoleQuery = "INSERT INTO roles (role) VALUES ?";
              const roleValues = rolesToInsert.map((role) => [role]);

              connection.query(insertRoleQuery, [roleValues], (err, result) => {
                if (err) {
                  console.error("Error inserting roles:", err);
                } else {
                  console.log("Roles inserted successfully");
                }
                // No connection.release() here, as we're inside another query callback
              });
            } else {
              console.log(
                "Roles table already contains 3 roles. No new roles inserted."
              );
            }
          }
        );
        
        // Create Pharmacies Table
        const createTableQueryPharmacies = `
          CREATE TABLE IF NOT EXISTS pharmacies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            street VARCHAR(255) NOT NULL,
            userId INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `;

        connection.query(createTableQueryPharmacies, (err, result) => {
          if (err) {
            console.error("Error creating pharmacies table:", err);
            connection.release();
            return;
          }
          console.log("Pharmacies Table created successfully");
        });

        // Create Products Table
        const createTableQueryProducts = `
          CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            produced VARCHAR(255) NOT NULL,
            price INT NOT NULL,
            pharmacyId INT NOT NULL,
            stock INT NOT NULL,
            FOREIGN KEY (pharmacyId) REFERENCES pharmacies(id) ON DELETE CASCADE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            image VARCHAR(255) NOT NULL
          )
        `;

        connection.query(createTableQueryProducts, (err, result) => {
          if (err) {
            console.error("Error creating products table:", err);
            connection.release();
            return;
          }
          console.log("Products Table created successfully");
        });

        // Create License Table
        const createTableQueryLicense = `
          CREATE TABLE IF NOT EXISTS license (
            id INT AUTO_INCREMENT PRIMARY KEY,
            licenseId BIGINT(10) UNIQUE,
            issueDate DATE NOT NULL,
            expiryDate DATE NOT NULL,
            license VARCHAR(255),
            status ENUM('PENDING', 'APPROVED', 'DECLINED') DEFAULT 'PENDING',
            userId INT NOT NULL UNIQUE,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
          )
        `;

        connection.query(createTableQueryLicense, (err, result) => {
          if (err) {
            console.error("Error creating license table:", err);
            connection.release();
            return;
          }
          console.log("License Table created successfully");
        });

        // Create Logins Table
        const createTableQueryLogins = `
          CREATE TABLE IF NOT EXISTS logins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            login_time DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `;
        
        connection.query(createTableQueryLogins, (err, result) => {
          if (err) {
            console.error('Error creating logins table:', err);
            connection.release();
            return;
          }
          console.log('Logins Table created successfully');
        });

        // Create Cart Table
        const createTableQueryCart = `
          CREATE TABLE IF NOT EXISTS cart (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            productId INT NOT NULL,
            FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
            quantity INT NOT NULL
          )
        `;
        
        connection.query(createTableQueryCart, (err, result) => {
          if (err) {
            console.error('Error creating cart table:', err);
            connection.release();
            return;
          }
          console.log('Cart Table created successfully');
        });

        // Create Cart Table
        const createTableQuerySales = `
          CREATE TABLE IF NOT EXISTS sales (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            productId INT NOT NULL,
            FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
            quantity INT NOT NULL,
            salePrice INT NOT NULL,
            saleDate DATETIME
          )
        `;
        
        connection.query(createTableQuerySales, (err, result) => {
          if (err) {
            console.error('Error creating sales table:', err);
            connection.release();
            return;
          }
          console.log('Sales Table created successfully');
        });


      });
    });
  });
};

module.exports = runMigrations;
