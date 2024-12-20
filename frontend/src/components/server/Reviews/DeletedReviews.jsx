import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MUIDataTable from 'mui-datatables';
import { Button, Box, ThemeProvider, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme'; // Import the theme

const DeletedReviews = () => {
  const [deletedReviews, setDeletedReviews] = useState([]);
  const navigate = useNavigate();

  const fetchDeletedReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/reviews/deleted', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const reviews = response.data.reviews.map((review) => ({
        ...review,
        userName: review.userId?.name || 'Unknown User',
        productName: review.productId?.name || 'Unknown Product',
        productImage: review.productId?.images?.[0] || null, // Use the first image if available
      }));

      setDeletedReviews(reviews);
    } catch (error) {
      console.error('Error fetching deleted reviews:', error);
      toast.error('An error occurred while fetching deleted reviews.');
    }
  };

  const handlePermanentDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/reviews/permanent-delete/${reviewId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      toast.success('Review permanently deleted!');
      fetchDeletedReviews();
    } catch (error) {
      console.error('Error permanently deleting review:', error);
      toast.error('Failed to permanently delete review.');
    }
  };

  useEffect(() => {
    fetchDeletedReviews();
  }, []);

  const columns = [
    {
      name: 'userName',
      label: 'Customer Name',
      options: {
        customBodyRender: (value) => (value ? value : 'N/A'),
      },
    },
    {
      name: 'productImage',
      label: 'Product Image',
      options: {
        customBodyRender: (value) =>
          value ? (
            <img
              src={value}
              alt="Product"
              style={{ width: 50, height: 50, objectFit: 'cover' }}
            />
          ) : (
            'No Image'
          ),
      },
    },
    {
      name: 'productName',
      label: 'Product Name',
      options: {
        customBodyRender: (value) => (value ? value : 'Unknown Product'),
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
            onClick={() => handlePermanentDelete(value)}
          >
            Permanently Delete
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
            onClick={() => navigate('/admin/CompletedReview')}
          >
            Back to Completed Reviews
          </Button>
        </Box>
        <MUIDataTable
          title="Deleted Reviews"
          data={deletedReviews}
          columns={columns}
          options={options}
        />
      </div>
    </ThemeProvider>
  );
};

export default DeletedReviews;
