import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MUIDataTable from 'mui-datatables';
import { Button, Box, ThemeProvider, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Toast styles
import theme from './theme'; // Import the theme

const CompletedReview = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/reviews/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const filteredReviews = response.data.reviews.filter((review) => !review.softDeleted); // Exclude soft-deleted reviews
      setReviews(filteredReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSoftDelete = async (reviewId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/v1/reviews/soft-delete/${reviewId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      toast.success('Review soft-deleted successfully!'); // Show success toast
      fetchReviews(); // Refresh reviews after soft delete
    } catch (error) {
      console.error('Error soft deleting review:', error);
      toast.error('Failed to soft delete the review.'); // Show error toast
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const columns = [
    {
      name: 'userId',
      label: 'Customer Name',
      options: {
        customBodyRender: (value) => (value && value.name ? value.name : 'N/A'),
      },
    },
    {
      name: 'productId',
      label: 'Product Image',
      options: {
        customBodyRender: (value) =>
          value && value.images && value.images.length > 0 ? (
            <img
              src={value.images[0]}
              alt="Product"
              style={{ width: 50, height: 50, objectFit: 'cover' }}
            />
          ) : (
            'No Image'
          ),
      },
    },
    {
      name: 'productId',
      label: 'Product Name',
      options: {
        customBodyRender: (value) => (value && value.name ? value.name : 'Unknown Product'),
      },
    },
    {
      name: 'reviewText',
      label: 'Review Text',
      options: {
        customBodyRender: (value) => (value ? value : 'No Review Text'),
      },
    },
    {
      name: 'images',
      label: 'Review Images',
      options: {
        customBodyRender: (value) =>
          Array.isArray(value) && value.length > 0 ? (
            value.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Review ${index}`}
                style={{ width: 50, height: 50, marginRight: 5 }}
              />
            ))
          ) : (
            'No Review Images'
          ),
      },
    },
    {
      name: 'rating',
      label: 'Rating',
      options: {
        customBodyRender: (value) =>
          value ? <div>{'⭐'.repeat(Math.round(value))}</div> : 'No Rating',
      },
    },
    {
      name: '_id',
      label: 'Action',
      options: {
        customBodyRender: (value) => (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleSoftDelete(value)}
          >
            Soft Delete
          </Button>
        ),
      },
    },
  ];

  const options = {
    selectableRows: 'none',
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ margin: '20px', fontFamily: 'Montserrat' }}>
        <Box display="flex" justifyContent="center" marginBottom="20px">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin/DeletedReviews')}
          >
            View Deleted Reviews
          </Button>
        </Box>
        <MUIDataTable
          title="Completed Reviews"
          data={reviews}
          columns={columns}
          options={options}
        />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} /> {/* Toast container */}
      </div>
    </ThemeProvider>
  );
};

export default CompletedReview;