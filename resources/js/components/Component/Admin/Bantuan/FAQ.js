import React, { useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { addFaq, getFaq, updateFaq } from "../../../Redux/Admin/action";
const Faq = (props) => {
  const [faqEditor, setFaqEditor] = React.useState("");
  const faqView = useSelector((state)=> state.admin.faq.data)
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getFaq())
  },[])
  return (
    <div className="App">
      <h2>FAQ</h2>
      <CKEditor
        editor={ClassicEditor}
        data={faqView[0]?.faq_description}
        // onReady={(editor) => {
        //   // You can store the "editor" and use when it is needed.
        // }}
        onChange={(event,editor) => {
          const data = editor.getData();
          setFaqEditor(data);
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
            faq_description : faqEditor
          }

          const id = faqView[0]?.id
          if(!faqView){
            const resp = await dispatch(addFaq(payload));
            if(resp.type === 'ADD_FAQ_ADMIN_SUCCESS'){
              alert('berhasil di tambah')
              window.location.reload();
            }else{
              alert('gagal')
            }
          }else if(faqView){
            const resp = await dispatch(updateFaq(payload,id));
            if(resp.type === 'PATCH_FAQ_ADMIN_SUCCESS'){
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

export default Faq;
