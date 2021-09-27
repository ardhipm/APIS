import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import SyaratDanKetentuan from '../Component/Admin/Bantuan/SyaratDanKetentuan';
import TabelLogistik from '../Component/Admin/Logistik/DataGridLogistik';
import EditDataLogistik from '../Component/Admin/Logistik/EditDataLogistik';
import DataGridPelanggan from '../Component/Admin/Pelanggan/DataGridPelanggan';
import FormulirTambahPelanggan from '../Component/Admin/Pelanggan/FormulirTambahPelanggan';
import Pembayaran from '../Component/Admin/Pembayaran/DataGridPembayaran';
import TabelPembayaran from '../Component/Admin/Pembayaran/DataGridPembayaran';
import FormulirPembayaran from '../Component/Admin/Pembayaran/UbahDataPembayaran';
import TabelPengguna from '../Component/Admin/PengurusAdmin/DataGridAdmin';
import history from '../history';
import { PrivateRoute } from '../Template/PrivateRoute';

import UserFAQ from '../Template/UserFAQ';
import UserInvoicePage from '../Template/UserInvoicePage';
import UserLogisticPage from '../Template/UserLogisticPage';
import UserPicturePage from '../Template/UserPicturePage';
import UserTermsConditionPage from '../Template/UserTermsConditionPage';



const Routes = () => (
    // const isLogged = useSelector(state => state.isLogged);
        <Switch>
            <PrivateRoute path="/pelanggan/paket" component={UserPicturePage} role={3} />
            <PrivateRoute path="/pelanggan/pembayaran" component={UserInvoicePage} role={3} />
            <PrivateRoute path="/pelanggan/logistik" component={UserLogisticPage} role={3}/>
            <PrivateRoute path="/pelanggan/syarat-ketentuan" component={UserTermsConditionPage} role={3}/>
            <PrivateRoute path="/pelanggan/faq" component={UserFAQ} role={3}/>
            <PrivateRoute path="/admin/pelanggan" exact component={DataGridPelanggan} role={2}/>
            <PrivateRoute path="/admin/pelanggan/edit" exact component={FormulirTambahPelanggan} role={2}/>
            <PrivateRoute path="/admin/pembayaran" exact component={TabelPembayaran} role={2}/>
            <PrivateRoute path="/admin/pembayaran/edit" exact component={FormulirPembayaran} role={2}/>
            <PrivateRoute path="/admin/logistik" exact component={TabelLogistik} role={2}/>
            <PrivateRoute path="/admin/pengguna" exact component={TabelPengguna} role={1}/>
            <PrivateRoute path="/admin/edit/syarat-ketentuan" exact component={SyaratDanKetentuan} role={2}/>
            <PrivateRoute path="/admin/edit/faq" exact component={SyaratDanKetentuan}role={1} />
            <PrivateRoute path="/admin/logistik/edit" exact component={EditDataLogistik}role={2} />

        </Switch>
    );



export default Routes