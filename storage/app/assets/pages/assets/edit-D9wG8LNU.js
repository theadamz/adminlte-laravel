import{y as s,A as n,e as r,M as i,s as d,m as l,B as u,f as _,r as f,g,l as e}from"./general-DAK3ebw_.js";let c=null;const v=document.querySelector("#formInput");let a={};function p(){_formValidation=$(v).validate({rules:{category:{required:!0},category_sub:{required:!0},type:{required:!0},manufacturer:{required:!0},certificate:{required:!0},license_id:{required:!0},license_key:{required:!0},order_id:{required:!0},supplier:{required:!0},purchase_no:{required:!0},purchase_date:{required:!0,dateValid:!0},purchase_cost:{required:!0,formatNumber:!0},purchase_qty:{required:!0,formatNumber:!0},expire_date:{required:!0,dateValid:!0},maintenance_contract_id:{required:!0}},submitHandler:y})}function L(){s("#purchase_date","date"),s("#expire_date","date"),n("#purchase_cost","float"),n("#purchase_qty","int"),document.getElementById("categoryLOV").addEventListener("click",O),document.getElementById("subCategoryLOV").addEventListener("click",h),document.getElementById("manufacturerLOV").addEventListener("click",F),document.getElementById("certificateLOV").addEventListener("click",b),document.getElementById("supplierLOV").addEventListener("click",q)}function V(){r("#license_id"),r("#license_key"),r("#order_id"),r("#purchase_no"),r("#maintenance_contract_id")}function y(){i.Confirm("Are you sure?").then(o=>{d(!0,"#save"),c=`${_baseURL}/inventories/os-licenses/${_id}`;const m="POST";_data2Send=new FormData($("#formInput")[0]),_data2Send.append("_method","PUT"),_data2Send.append("is_reassignable",$("#is_reassignable").is(":checked")),_data2Send.append("purchase_date",l($("#purchase_date").datetimepicker("viewDate"),"YYYY-MM-DD")),_data2Send.append("expire_date",l($("#expire_date").datetimepicker("viewDate"),"YYYY-MM-DD")),_data2Send.append("purchase_cost",u($("#purchase_cost").val())),_data2Send.append("purchase_qty",u($("#purchase_qty").val())),_(c,m,_data2Send,null).then(t=>{[200].includes(t.status)?(Toast.fire({icon:"success",title:t.statusText,text:t.data.message}),$("#modalFormInput").modal("hide")):(i.HtmlNotification(f(t.data),`${t.status} - ${t.statusText}`),g(t.data.errors)),d(!1,"#save")}).catch(t=>{i.Notification(t.toString()),d(!1,"#save")})}).catch(o=>{o&&console.log(o)})}function O(){e(),$("#_dynamic_content").load(`${_baseURL}/lov/configs/inventories/categories?is_active=true`,()=>{e(!1),$("#_modal_lov").modal("show"),$(".modal-dialog").addClass("modal-lg"),$("#_modal_lov").on("hide.bs.modal",function(){if($resultFromLOV.result){if(a.category==$resultFromLOV.data.id)return;a.category=$resultFromLOV.data.id,$("#category").val($resultFromLOV.data.id),$("#category_name").val($resultFromLOV.data.name),$("#category_sub").val(null),$("#category_sub_name").val(null)}})})}function h(){$("#category").val()&&(e(),$("#_dynamic_content").load(`${_baseURL}/lov/configs/inventories/sub-categories?category=${$("#category").val()}`,()=>{e(!1),$("#_modal_lov").modal("show"),$(".modal-dialog").addClass("modal-lg"),$("#_modal_lov").on("hide.bs.modal",function(){if($resultFromLOV.result){if(a.category_sub==$resultFromLOV.data.id)return;a.category_sub=$resultFromLOV.data.id,$("#category_sub").val($resultFromLOV.data.id),$("#category_sub_name").val($resultFromLOV.data.name)}})}))}function F(){e(),$("#_dynamic_content").load(`${_baseURL}/lov/configs/inventories/manufacturers?is_active=true`,()=>{e(!1),$("#_modal_lov").modal("show"),$(".modal-dialog").addClass("modal-lg"),$("#_modal_lov").on("hide.bs.modal",function(){if($resultFromLOV.result){if(a.manufacturer==$resultFromLOV.data.id)return;a.manufacturer=$resultFromLOV.data.id,$("#manufacturer").val($resultFromLOV.data.id),$("#manufacturer_name").val($resultFromLOV.data.name)}})})}function b(){e(),$("#_dynamic_content").load(`${_baseURL}/lov/configs/inventories/certificates`,()=>{e(!1),$("#_modal_lov").modal("show"),$(".modal-dialog").addClass("modal-lg"),$("#_modal_lov").on("hide.bs.modal",function(){if($resultFromLOV.result){if(a.certificate==$resultFromLOV.data.id)return;a.certificate=$resultFromLOV.data.id,$("#certificate").val($resultFromLOV.data.id),$("#certificate_name").val($resultFromLOV.data.name)}})})}function q(){e(),$("#_dynamic_content").load(`${_baseURL}/lov/configs/inventories/suppliers?is_active=true`,()=>{e(!1),$("#_modal_lov").modal("show"),$(".modal-dialog").addClass("modal-lg"),$("#_modal_lov").on("hide.bs.modal",function(){if($resultFromLOV.result){if(a.supplier==$resultFromLOV.data.id)return;a.supplier=$resultFromLOV.data.id,$("#supplier").val($resultFromLOV.data.id),$("#supplier_name").val($resultFromLOV.data.name)}})})}document.addEventListener("DOMContentLoaded",function(){p(),L(),V()});