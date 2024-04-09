// Define the migration logic
const runMigrations = (pool) => {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting connection from pool:', err);
        return;
      }
      console.log('Connected to MySQL database');
  
      // Create Users Table
      const createTableQueryUsers = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          firstname VARCHAR(255) NOT NULL,
          lastname VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          roleId INT DEFAULT 3
        )
      `;
  
      connection.query(createTableQueryUsers, (err, result) => {
        if (err) {
          console.error('Error creating users table:', err);
          connection.release(); // Release the connection back to the pool
          return;
        }
        console.log('Users Table created successfully');
  
        // Create Roles Table
        const createTableQueryRoles = `
          CREATE TABLE IF NOT EXISTS roles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            role VARCHAR(255) NOT NULL
          )
        `;
  
        connection.query(createTableQueryRoles, (err, result) => {
          if (err) {
            console.error('Error creating roles table:', err);
            connection.release(); // Release the connection back to the pool
            return;
          }
          console.log('Roles Table created successfully');
  
          // Insert data into the Roles table
          const roles = ['superadmin', 'admin', 'user'];
          const insertDataQuery = `INSERT INTO roles (role) VALUES ?`;
          const values = roles.map(role => [role]);
  
          connection.query(insertDataQuery, [values], (err, result) => {
            if (err) {
              console.error('Error inserting data into roles table:', err);
              connection.release(); // Release the connection back to the pool
              return;
            }
            console.log('Data inserted into roles table');
  
            // Release the connection back to the pool
            connection.release();
          });
        });
      });
    });
  };
  
  module.exports = runMigrations;
  