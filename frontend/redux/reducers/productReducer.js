const initialState = {
    loading: false,
    products: [],
    deletedProducts: [],
    error: null,
  };
  
  const productReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_PRODUCTS_REQUEST':
      case 'CREATE_PRODUCT_REQUEST':
      case 'DELETE_PRODUCT_REQUEST':
      case 'FETCH_DELETED_PRODUCTS_REQUEST':
      case 'RESTORE_PRODUCT_REQUEST':
        return { ...state, loading: true };
      
      case 'FETCH_PRODUCTS_SUCCESS':
        return { ...state, loading: false, products: action.payload };
        
      case 'CREATE_PRODUCT_SUCCESS':
        return { ...state, loading: false, products: [...state.products, action.payload] };
      
      case 'DELETE_PRODUCT_SUCCESS':
        return { ...state, loading: false, products: state.products.filter(p => p._id !== action.payload) };
      
      case 'FETCH_DELETED_PRODUCTS_SUCCESS':
        return { ...state, loading: false, deletedProducts: action.payload };
  
      case 'RESTORE_PRODUCT_SUCCESS':
        return { ...state, loading: false, deletedProducts: state.deletedProducts.filter(p => p._id !== action.payload) };
  
      case 'FETCH_PRODUCTS_FAILURE':
      case 'CREATE_PRODUCT_FAILURE':
      case 'DELETE_PRODUCT_FAILURE':
      case 'FETCH_DELETED_PRODUCTS_FAILURE':
      case 'RESTORE_PRODUCT_FAILURE':
        return { ...state, loading: false, error: action.payload };
      
      default:
        return state;
    }
  };
  
  export default productReducer;
  