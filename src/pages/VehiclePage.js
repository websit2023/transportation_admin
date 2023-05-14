import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useState } from 'react';
// @mui
import { Box, Container, Divider, Modal, Stack, Typography } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductForm } from '../sections/@dashboard/products';
// mock
import { getVehicleList } from 'src/services/vehicle';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    (async () => {
      await getList()
    })()
  }, [])

  const getList = async () => {
    const data = await getVehicleList()
    setVehicles(data)
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedVehicle(null)
  };

  const selectVehicle = useCallback((vehicle) => {
    setSelectedVehicle(vehicle)
    setOpenModal(true)
  }, [])

  return (
    <>
      <Helmet>
        <title> Dashboard: Vehicles | Minimal UI </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Vehicles
        </Typography>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={vehicles} selectProduct={selectVehicle} />
        <ProductCartWidget onOpen={handleOpenModal} />

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 1000,
            backgroundColor: "#fff",
            boxShadow: 24,
            p: 4,
          }}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
              {selectedVehicle ? "Update vehicle" : "Create new vehicle"}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <ProductForm vehicle={selectedVehicle} refresh={getList}/>
          </Box>
        </Modal>
      </Container>
    </>
  );
}
