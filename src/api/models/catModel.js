import promisePool from '../../utils/database.js';

// Get all cats from database with owner names
const getAllCats = async () => {
  try {
    const [rows] = await promisePool.execute(
      `SELECT c.cat_id, c.cat_name, c.birthdate, c.weight, c.owner, c.filename, u.name as owner_name 
       FROM wsk_cats c 
       LEFT JOIN wsk_users u ON c.owner = u.user_id`
    );
    return rows;
  } catch (error) {
    console.error('Error getting all cats:', error);
    throw error;
  }
};

// Get cat by id from database with owner name
const getCatById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      `SELECT c.cat_id, c.cat_name, c.birthdate, c.weight, c.owner, c.filename, u.name as owner_name 
       FROM wsk_cats c 
       LEFT JOIN wsk_users u ON c.owner = u.user_id 
       WHERE c.cat_id = ?`,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error('Error getting cat by id:', error);
    throw error;
  }
};

// Get cats by user id
const getCatsByUserId = async (userId) => {
  try {
    const [rows] = await promisePool.execute(
      `SELECT c.cat_id, c.cat_name, c.birthdate, c.weight, c.owner, c.filename, u.name as owner_name 
       FROM wsk_cats c 
       LEFT JOIN wsk_users u ON c.owner = u.user_id 
       WHERE c.owner = ?`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error('Error getting cats by user id:', error);
    throw error;
  }
};

// Add new cat to database
const addCat = async (cat) => {
  try {
    const { cat_name, birthdate, weight, owner, filename } = cat;
    const [result] = await promisePool.execute(
      'INSERT INTO wsk_cats (cat_name, birthdate, weight, owner, filename) VALUES (?, ?, ?, ?, ?)',
      [cat_name, birthdate, weight, owner, filename]
    );
    return { cat_id: result.insertId, ...cat };
  } catch (error) {
    console.error('Error adding cat:', error);
    throw error;
  }
};

// Update cat in database
const updateCat = async (id, cat, currentUser) => {
  try {
    const { cat_name, birthdate, weight, owner, filename } = cat;

    if (currentUser.role === 'admin') {
      // Admin can update any cat
      const [result] = await promisePool.execute(
        'UPDATE wsk_cats SET cat_name = ?, birthdate = ?, weight = ?, owner = ?, filename = ? WHERE cat_id = ?',
        [cat_name, birthdate, weight, owner, filename, id]
      );
      return result.affectedRows > 0;
    } else {
      // Regular users can only update their own cats
      const [result] = await promisePool.execute(
        'UPDATE wsk_cats SET cat_name = ?, birthdate = ?, weight = ?, owner = ?, filename = ? WHERE cat_id = ? AND owner = ?',
        [cat_name, birthdate, weight, owner, filename, id, currentUser.user_id]
      );
      return result.affectedRows > 0;
    }
  } catch (error) {
    console.error('Error updating cat:', error);
    throw error;
  }
};

// Delete cat from database
const deleteCat = async (id, currentUser) => {
  try {
    if (currentUser.role === 'admin') {
      // Admin can delete any cat
      const [result] = await promisePool.execute(
        'DELETE FROM wsk_cats WHERE cat_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } else {
      // Regular users can only delete their own cats
      const [result] = await promisePool.execute(
        'DELETE FROM wsk_cats WHERE cat_id = ? AND owner = ?',
        [id, currentUser.user_id]
      );
      return result.affectedRows > 0;
    }
  } catch (error) {
    console.error('Error deleting cat:', error);
    throw error;
  }
};

export {
  getAllCats,
  getCatById,
  getCatsByUserId,
  addCat,
  updateCat,
  deleteCat,
};
