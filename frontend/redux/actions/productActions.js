import axios from 'axios';

// Fetch Products
export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_PRODUCTS_REQUEST' });
    const { data } = await axios.get('http://localhost:5000/api/v1/products');
    dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: data.products });
  } catch (error) {
    dispatch({ type: 'FETCH_PRODUCTS_FAILURE', payload: error.message });
  }
};

// Create Product
export const createProduct = (formData) => async (dispatch) => {
  try {
    dispatch({ type: 'CREATE_PRODUCT_REQUEST' });
    const { data } = await axios.post('http://localhost:5000/api/v1/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch({ type: 'CREATE_PRODUCT_SUCCESS', payload: data.product });
  } catch (error) {
    dispatch({ type: 'CREATE_PRODUCT_FAILURE', payload: error.message });
  }
};

// Delete Product (Soft Delete)
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'DELETE_PRODUCT_REQUEST' });
    await axios.delete(`http://localhost:5000/api/v1/products/${id}`);
    dispatch({ type: 'DELETE_PRODUCT_SUCCESS', payload: id });
  } catch (error) {
    dispatch({ type: 'DELETE_PRODUCT_FAILURE', payload: error.message });
  }
};

// Fetch Deleted Products
export const fetchDeletedProducts = () => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_DELETED_PRODUCTS_REQUEST' });
    const { data } = await axios.get('http://localhost:5000/api/v1/products/deleted');
    dispatch({ type: 'FETCH_DELETED_PRODUCTS_SUCCESS', payload: data.products });
  } catch (error) {
    dispatch({ type: 'FETCH_DELETED_PRODUCTS_FAILURE', payload: error.message });
  }
};

// Restore Product
export const restoreProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'RESTORE_PRODUCT_REQUEST' });
    await axios.put(`http://localhost:5000/api/v1/products/restore/${id}`);
    dispatch({ type: 'RESTORE_PRODUCT_SUCCESS', payload: id });
  } catch (error) {
    dispatch({ type: 'RESTORE_PRODUCT_FAILURE', payload: error.message });
  }
};
