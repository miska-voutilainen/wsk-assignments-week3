import promisePool from '../../utils/database.js';

// Get all users from database
const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM wsk_users');
    return rows;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Get user by id from database
const getUserById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM wsk_users WHERE user_id = ?',
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error('Error getting user by id:', error);
    throw error;
  }
};

// Add new user to database
const addUser = async (user) => {
  try {
    const { name, username, email, role, password } = user;
    const [result] = await promisePool.execute(
      'INSERT INTO wsk_users (name, username, email, role, password) VALUES (?, ?, ?, ?, ?)',
      [name, username, email, role, password]
    );
    return { user_id: result.insertId, ...user };
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Update user in database
const updateUser = async (id, user) => {
  try {
    const { name, username, email, role, password } = user;
    const [result] = await promisePool.execute(
      'UPDATE wsk_users SET name = ?, username = ?, email = ?, role = ?, password = ? WHERE user_id = ?',
      [name, username, email, role, password, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete user from database with transaction to handle foreign key constraints
const deleteUser = async (id) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    // First delete all cats belonging to the user
    await connection.execute('DELETE FROM wsk_cats WHERE owner = ?', [id]);

    // Then delete the user
    const [result] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ?',
      [id]
    );
    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting user:', error);
    throw error;
  } finally {
    connection.release();
  }
};

export { getAllUsers, getUserById, addUser, updateUser, deleteUser };
