import React from 'react';
// import MainPage from './MainPage';
import { createBrowserHistory } from 'history';
import { Router, Route, withRouter, Switch, Redirect } from 'react-router-dom';
import Login from '../Component/Login/Login';
import { PrivateRoute } from './PrivateRoute';

import UserFAQ from '../Template/UserFAQ';
import UserInvoicePage from '../Template/UserInvoicePage';
import UserLogisticPage from '../Template/UserLogisticPage';
import UserPicturePage from '../Template/UserPicturePage';
import UserPictureSimplePage from '../Template/UserPictureSimplePage';
import UserTermsConditionPage from '../Template/UserTermsConditionPage';
import SyaratDanKetentuan from '../Component/Admin/Bantuan/SyaratDanKetentuan';
import TabelLogistik from '../Component/Admin/Logistik/DataGridLogistik';
import DataGridPelanggan from '../Component/Admin/Pelanggan/DataGridPelanggan';
import FormulirTambahPelanggan from '../Component/Admin/Pelanggan/FormulirTambahPelanggan';
import TabelPembayaran from '../Component/Admin/Pembayaran/DataGridPembayaran';
import TabelPengguna from '../Component/Admin/PengurusAdmin/DataGridAdmin';
import EditDataLogistik from '../Component/Admin/Logistik/EditDataLogistik';
import EditDataPembayaran from '../Component/Admin/Pembayaran/UbahDataPembayaran';
import FormulirAdminMember from '../Component/Admin/PengurusAdmin/FormulirAdminMember';
import TambahAdmin from '../Component/Admin/PengurusAdmin/TambahAdmin';
import Faq from '../Component/Admin/Bantuan/FAQ';
import Test from '../Component/Test/Test';
import OriginPhotoPage from '../Component/User/OriginPhotoPage/OriginPhotoPage';
import ChoicePhotoPage from '../Component/User/ChoicePhotoPage/ChoicePhotoPage';
import NotificationPage from '../Component/Admin/Notifikasi/NotificationPage';

// const history = createBrowserHistory();

const MainRouter = () => (
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/login" exact component={Login} />
                {/* <PrivateRoute path="/mainpage" component={UserPicturePage} 
                    role={[1]} /> */}
                <PrivateRoute path="/pelanggan/paket" exact  showTab={true} component={OriginPhotoPage} role={[1]} tabValue={0}/>
                <PrivateRoute path="/pelanggan/paket/foto-mentah" exact  showTab={true} component={OriginPhotoPage} role={[1]} tabValue={0}/>
                <PrivateRoute path="/pelanggan/paket/foto-pilihan" exact  showTab={true} component={ChoicePhotoPage} role={[1]} tabValue={1}/>
                {/* <PrivateRoute path="/pelanggan/paket" exact 
                    component={UserPicturePage} 
                    role={[1]} 
                    key="/api/drive/get_origin_photo"
                    apiLink="/api/drive/get_origin_photo" 
                    showTab={true}
                    tabValue={0} 
                    /> */}
                {/* <PrivateRoute path="/pelanggan/paket/foto-mentah" exact 
                    component={UserPicturePage} 
                    role={[1]} 
                    key="/api/drive/get_origin_photo"
                    apiLink="/api/drive/get_origin_photo" 
                    showTab={true}
                    tabValue={0}/>
                <PrivateRoute path="/pelanggan/paket/foto-pilihan" exact 
                    component={UserPicturePage} role={[1]} 
                    key="/api/drive/get_choice_photo"
                    apiLink="/api/drive/get_choice_photo" 
                    showTab={true}
                    tabValue={1}/> */}
                {/* <PrivateRoute path="/pelanggan/paket/foto-akhir" exact 
                    component={UserPicturePage} role={[1]}  
                    key="/api/drive/get_final_photo"
                    apiLink="/api/drive/get_final_photo" 
                    showTab={true}
                    tabValue={2}/> */}
                <PrivateRoute path="/pelanggan/paket/video" exact component={UserPictureSimplePage} 
                    role={[1]} key="/api/drive/get_video" 
                    apiLink="/api/drive/get_video" 
                    showTab={true}
                    tabValue={2}
                    name="Video"/>
                <PrivateRoute path="/pelanggan/paket/album" exact component={UserPictureSimplePage} 
                    role={[1]} key="/api/drive/get_album" 
                    apiLink="/api/drive/get_album" 
                    showTab={true}
                    tabValue={3}
                    name="Album"/>
                <PrivateRoute path="/pelanggan/pembayaran"  component={UserInvoicePage} role={[1]}/>
                <PrivateRoute path="/pelanggan/logistik"  component={UserLogisticPage} role={[1]} />
                <PrivateRoute path="/pelanggan/syarat-ketentuan" component={UserTermsConditionPage} role={[1]}/>
                <PrivateRoute path="/pelanggan/faq" component={UserFAQ} role={[1]}/>
                <PrivateRoute path="/admin/pelanggan" exact component={DataGridPelanggan} role={[2,3]}/>
                <PrivateRoute path="/admin/pelanggan/edit" exact component={FormulirTambahPelanggan} role={[2,3]}/>
                <PrivateRoute path="/admin/pelanggan/edit/:customerId" exact component={FormulirTambahPelanggan} role={[2,3]}/>
                <PrivateRoute path="/admin/pembayaran" exact component={TabelPembayaran} role={[2,3]}/>
                <PrivateRoute path="/admin/pembayaran/edit/:customerId" exact component={EditDataPembayaran} role={[2,3]}/>
                <PrivateRoute path="/admin/logistik" exact component={TabelLogistik} role={[2,3]}/>
                <PrivateRoute path="/admin/logistik/edit/:customerId" exact component={EditDataLogistik} role={[2,3]}/>
                <PrivateRoute path="/admin/pengguna" exact component={TabelPengguna} role={[2]}/>
                <PrivateRoute path="/admin/pengguna/edit/:adminId" exact component={FormulirAdminMember} role={[2]}/>
                <PrivateRoute path="/admin/pengguna/tambah" exact component={FormulirAdminMember} role={[2]}/>
                <PrivateRoute path="/admin/edit/syarat-ketentuan" exact  component={SyaratDanKetentuan} role={[2,3]} />
                <PrivateRoute path="/admin/edit/faq" exact  component={Faq} role={[2,3]}/>
                <PrivateRoute path="/admin/notifikasi" exact  component={NotificationPage} role={[2,3]}/>
            </Switch>
        // </Router>
    );

export default withRouter(MainRouter);