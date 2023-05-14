import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Modal,
  Box,
  Divider,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { ScheduleListHead, ScheduleListToolbar } from '../sections/@dashboard/schedule';
import ScheduleForm from 'src/sections/@dashboard/schedule/ScheduleForm';
import { deleteSchedule, getScheduleList } from 'src/services/schedule';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'route_name', label: 'Route Name', alignRight: false },
  { id: 'start_time', label: 'Start Time', alignRight: false },
  { id: 'end_time', label: 'End Time', alignRight: false },
  { id: 'driver', label: 'Driver', alignRight: false },
  { id: 'vehicle', label: 'Vehicle', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_schedule) => _schedule.route.route_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function SchedulePage() {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [scheduleList, setScheduleList] = useState([])
  const [selectedSchedule, setSelectedSchedule] = useState(null)

  useEffect(() => {
    (async () => {
      await getList()
    })()
  }, [])

  const getList = async () => {
    const schedules = await getScheduleList()
    setScheduleList(schedules)
  }

  const handleOpenMenu = (e, row) => {
    setOpen(e.currentTarget);
    setSelectedSchedule(row)
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setSelectedSchedule(null)
  };

  const handleEdit = () => {
    setOpenModal(true);
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSchedule(null)
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = scheduleList.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteSchedules = async () => {
    await Promise.all(selected.map(async (scheduleId) => {
      await deleteSchedule(scheduleId)
    }))

    await getList();
    setSelected([])
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - scheduleList.length) : 0;

  const filteredSchedules = applySortFilter(scheduleList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredSchedules.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Schedule | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Schedule
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
            New Schedule
          </Button>
        </Stack>

        <Card>
          <ScheduleListToolbar
            onDeleteSchedules={handleDeleteSchedules}
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ScheduleListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={scheduleList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredSchedules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    let { _id, route, start_time, end_time, driver, vehicle } = row;
                    const selectedSchedule = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow hover key={index} tabIndex={-1} role="checkbox" selected={selectedSchedule}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedSchedule} onChange={(event) => handleClick(event, _id)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Typography variant="subtitle2" noWrap sx={{ ml: '16px' }}>
                            {route.route_name}
                          </Typography>
                        </TableCell>

                        <TableCell align="left">{dayjs(start_time).format("MM/DD/YYYY")}</TableCell>

                        <TableCell align="left">{dayjs(end_time).format("MM/DD/YYYY")}</TableCell>

                        <TableCell align="left">
                          {driver.driver_name}
                        </TableCell>

                        <TableCell align="left">
                          {vehicle.vehicle_name}
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={scheduleList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={e => handleClick(e, selectedSchedule._id)} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

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
          width: 500,
          backgroundColor: "#fff",
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            {selectedSchedule ? "Update schedule" : "Create new schedule"}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <ScheduleForm scheduleData={selectedSchedule} refresh={getList} />
        </Box>
      </Modal>
    </>
  );
}
