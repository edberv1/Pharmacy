// Define the migration logic
const runMigrations = (pool) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return;
    }
    
    console.log('Connected to MySQL database');
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

      // Create Users Table
      const createTableQueryUsers = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          firstname VARCHAR(255) NOT NULL,
          lastname VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          roleId INT,
          FOREIGN KEY (roleId) REFERENCES roles(id)
        )
      `;

      connection.query(createTableQueryUsers, (err, result) => {
        if (err) {
          console.error('Error creating users table:', err);
          connection.release(); // Release the connection back to the pool
          return;
        }
        console.log('Users Table created successfully');

        // Insert initial roles if necessary
        connection.query('SELECT COUNT(*) AS roleCount FROM roles', (err, rows) => {
          if (err) {
            console.error('Error counting roles:', err);
            connection.release(); // Release the connection back to the pool
            return;
          }

          const roleCount = rows[0].roleCount;
          if (roleCount < 4) {
            const rolesToInsert = ['superadmin', 'admin', 'user'];
            const insertRoleQuery = 'INSERT INTO roles (role) VALUES ?';
            const roleValues = rolesToInsert.map(role => [role]);

            connection.query(insertRoleQuery, [roleValues], (err, result) => {
              if (err) {
                console.error('Error inserting roles:', err);
                connection.release(); // Release the connection back to the pool
                return;
              }
              console.log('Roles inserted successfully');
              connection.release(); // Release the connection back to the pool
            });
          } else {
            console.log('Roles table already contains 3 roles. No new roles inserted.');
            connection.release(); // Release the connection back to the pool
          }
        });
      });
    });
  });
};

module.exports = runMigrations;
