import React, { useState, useEffect} from "react";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import DeleteIcon from '@material-ui/icons/Delete';
import {BsCircleFill,BsPersonPlusFill} from 'react-icons/bs'
import {BiEdit} from 'react-icons/bi'
import SearchIcon from '@material-ui/icons/Search';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {getData} from '../../../Api/httpRequest'
import {deleteInvoice, getInvoice} from '../../../Redux/Admin/action'


// function createData(id_pelanggan, nama_pelanggan, nama_pasangan, no_hp, paket,status) {
//   return { id_pelanggan, nama_pelanggan, nama_pasangan, no_hp, paket,status};
// }

// const rows = [
  
// ];


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

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'customer_id', numeric: false, disablePadding: true, label: 'ID Pelanggan' },
  { id: 'name', numeric: true, disablePadding: false, label: 'Nama Pelanggan' },
  { id: 'partner_name', numeric: true, disablePadding: false, label: 'Nama Pasangan' },
  { id: 'invoice_no', numeric: true, disablePadding: false, label: 'Nomor Struk' },
  { id: 'id_payment_status', numeric: true, disablePadding: false, label: 'Status' },
  { id: 'edit', numeric: true, disablePadding: true, label: 'Edit' },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.customer_id}
            align="center"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.customer_id ? order : false}
          ><b>
            <TableSortLabel
              style={{marginLeft:20}}
              active={orderBy === headCell.customer_id}
              direction={orderBy === headCell.customer_id ? order : "asc"}
              onClick={createSortHandler(headCell.customer_id)}
            >
              {headCell.label}
              {orderBy === headCell.customer_id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
            </b>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: "1 1 100%"
  }
}));

const EnhancedTableToolbar = (props) => {
  const dispatch = useDispatch();
  const classes = useToolbarStyles();
  const { numSelected } = props;
  // const rows = useSelector((state) => state.admin.customers.data)
  // let dataTable = rows ? rows : [];
  // const [row,setRows] = useState(rows);
  const [searched, setSearched] = useState();
  const [rows ,setRows] = React.useState([]);
  
  const requestSearch = (searchedVal) => {
    const filteredRows = rows.filter((row) => {
      return Object.keys(row).some((key) =>
        row[key].includes(searchedVal)
      );
    });
    setRows(filteredRows);    
  };
 
  const cancelSearch = () => {
    setSearched();
    requestSearch(searched);
  };


  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
          style={numSelected > 0 ?{}:{display:"none"}}
        >
          {numSelected} selected
        </Typography>
      <Tooltip title="Delete" style={numSelected > 0 ?{}:{display:"none"}}>
          <IconButton aria-label="delete"
          onClick={async()=>{
            const payload = {
              list_delete:props.newSelected
            }
            const resp = await dispatch(deleteInvoice(payload));
            if(resp.type === 'DELETE_INVOICE_ADMIN_SUCCESS'){
              alert('berhasil di hapus')
              window.location.reload();
            }else{
              alert('gagal')
            }
          }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  buttonAdd:{
    backgroundColor:"#171717",
    color:"#FFFF",
    textTransform:"capitalize",
    paddingRight:"2em",
    paddingLeft:"2em",
    paddingTop:"1em",
    paddingBottom:"1em",
    "&:hover, &:focus": {
      backgroundColor:"#FFFF",
      color:"#171717"
    },
  }
}));

export default function TabelPembayaran() {

  const dispatch = useDispatch();
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const history = useHistory();
  const [searched, setSearched] = useState();
  const rows = useSelector((state) => state.admin.invoices.data);
  const [data ,setRows] = React.useState(rows);
  
  useEffect(() => {
    dispatch(getInvoice())
  }, []);
  const requestSearch = (searchedVal) => {
    const filteredRows = rows.filter((data) => {
      return Object.keys(data).some((key) =>
      (typeof data[key] === 'string' || typeof data[key] ==='number') && 
      data[key].toString().toLowerCase().includes(searchedVal.target.value)
      );
    });
    setRows(filteredRows);    
  };
  // //console.log('rows',typeof rows[0].id)
  useEffect(()=>{
    setRows(rows);
  },[rows])
  const cancelSearch = () => {
    setSearched();
    requestSearch(searched);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.customer_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <div style={{display:"flex"}}>
        <h2>Data Pembayaran</h2>
        <div style={{
          position:"absolute",
          right:30
        }}>
        </div>
      </div>
      <EnhancedTableToolbar numSelected={selected.length} newSelected={selected} />
      <Paper className={classes.paper} style={!selected.length ? {marginTop:"-50px"}:{}}>
        <div style={{marginLeft:"20px",paddingTop:"2em",display:"flex"}}>
              <div style={{
                flexBasis:"70%"
              }}>
              <Typography
                  className={classes.title}
                  variant="h6"
                  id="tableTitle"
                  component="div"
                >
                  <b>
              Resi Pengiriman
              </b>
            </Typography>
            </div>
            <div style={{
              position:"absolute",
              right:35,
              marginTop:"-20px"
            }}>
            <Tooltip title="Cari">
              <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password"><b>Cari Pelanggan</b></InputLabel>
              <OutlinedInput
                id="outlined-adornment"
                endAdornment={
                  <InputAdornment position="start" >
                      <SearchIcon />
                  </InputAdornment>
                }
                labelWidth={120}
                value={searched}
                  onChange={(searchVal) => requestSearch(searchVal)}
                  // onCancelSearch={() => cancelSearch()}
              />
            </FormControl>
        </Tooltip>
            </div>
            </div>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.customer_id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  // //console.log(row.partner_name)
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.customer_id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.customer_id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell align="center" id={labelId} scope="row">
                        {row.customer_id}
                      </TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.partner_name}</TableCell>
                      <TableCell align="center">{row.invoice_no}</TableCell>
                      <TableCell align="center">{row.id_payment_status === 1 ? 
                      "Lunas"
                      :'Belum Lunas'}</TableCell>
                      <TableCell align="center"><Button style={{color:"#000",marginRight:5, backgroundColor:'transparent', textTransform:'capitalize'}}
                        onClick={()=>{
                          // e.preventDefault();
                          history.push('/admin/pembayaran/edit/'+row.invoice_id)
                        }}
                      ><BiEdit/> Edit</Button></TableCell>

                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper> 
    </div>
  );
}
