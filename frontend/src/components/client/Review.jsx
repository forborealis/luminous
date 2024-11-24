import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Pagination,
  CircularProgress,
  Typography,
  Button,
  Rating,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning'; // Import Warning Icon

const Review = () => {
  const [reviewedItems, setReviewedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch reviewed items for the user
  const fetchReviewedItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/reviews/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReviewedItems(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviewed items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewedItems();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography variant="h6" color="textSecondary" sx={{ ml: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!reviewedItems.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="textSecondary" sx={{ fontFamily: 'Montserrat' }}>
          You have no reviewed products.
        </Typography>
      </Box>
    );
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Paginate reviewed items
  const paginatedItems = reviewedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mx-auto p-4 font-montserrat">
      <Box mb={2} display="flex" justifyContent="space-between">
        <Button onClick={() => navigate('/completed-order')} variant="contained" color="primary">
          Back to Completed Orders
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontFamily: 'Montserrat' }}></TableCell>
              <TableCell sx={{ fontFamily: 'Montserrat' }}>Product</TableCell>
              <TableCell sx={{ fontFamily: 'Montserrat' }}>Rating</TableCell>
              <TableCell sx={{ fontFamily: 'Montserrat' }}>Review</TableCell>
              <TableCell sx={{ fontFamily: 'Montserrat' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((item) => (
              <TableRow
                key={item._id}
                style={{
                  opacity: item.softDeleted ? 0.5 : 1, 
                  cursor: item.softDeleted ? 'not-allowed' : 'pointer', 
                }}
                onMouseEnter={(e) => {
                  if (item.softDeleted) e.target.style.cursor = 'not-allowed';
                }}
              >
                <TableCell sx={{ fontFamily: 'Montserrat' }}>
                  {item.softDeleted ? (
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <WarningIcon color="warning" /> 
                    </Box>
                  ) : (
                    <img
                      src={item.productId?.images[0]} 
                      alt={item.productId?.name}
                      className="w-16 h-16 object-cover mx-auto"
                    />
                  )}
                </TableCell>
                <TableCell sx={{ fontFamily: 'Montserrat' }}>{item.productId?.name || 'Unknown Product'}</TableCell>
                <TableCell sx={{ fontFamily: 'Montserrat' }}>
                  <Rating value={item.rating} readOnly precision={0.5} size="small" />
                </TableCell>
                <TableCell sx={{ fontFamily: 'Montserrat' }}>{item.reviewText}</TableCell>
                <TableCell sx={{ fontFamily: 'Montserrat' }}>
                  <Button
                    onClick={() => navigate(`/update-review/${item._id}`)} 
                    variant="outlined"
                    color="secondary"
                    disabled={item.softDeleted} 
                  >
                    Update Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(reviewedItems.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </div>
  );
};

export default Review;