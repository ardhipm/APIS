import React, { useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { addTerms, getTerms, updateTerms } from "../../../Redux/Admin/action";
const SyaratDanKetentuan = () => {
  const [termsEditor, settermsEditor] = React.useState("");
  const dataTerms = useSelector((state)=> state.admin.terms.data)
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getTerms())
  },[])
  return (
    <div className="App">
      <h2>Syarat Dan Ketentuan</h2>
      <CKEditor
        editor={ClassicEditor}
        data={dataTerms[0]?.term_description}
        onChange={(event, editor) => {
          const data = editor.getData();
          settermsEditor(data);
        }}
      />
      <Button
        style={{
          width: "100%",
          backgroundColor: "#000",
          color: "#FFFF"
        }}
        onClick={async()=>{
          const payload ={
            term_description : termsEditor
          }
          const id = dataTerms[0]?.id
          if(!dataTerms){
            const resp = await dispatch(addTerms(payload));
            if(resp.type === 'ADD_TERMS_ADMIN_SUCCESS'){
              alert('berhasil di tambah')
              window.location.reload();
            }else{
              alert('gagal')
            }
          }else if(dataTerms){
            const resp = await dispatch(updateTerms(payload,id));
            if(resp.type === 'PATCH_TERMS_ADMIN_SUCCESS'){
              alert('berhasil di tambah')
              window.location.reload();
            }else{
              alert('gagal')
            }
          }
          
        }}
      >
        simpan
      </Button>
    </div>
  );
};

export default SyaratDanKetentuan;
